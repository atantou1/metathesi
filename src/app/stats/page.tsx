'use client'

import PostingZonesMapClient from './PostingZonesMapClient'
import { Suspense, useState, useEffect, useRef } from 'react'

// ─── useIsMobile hook ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Specialty {
  code: string
  name: string
  isPrimary: boolean
  isSecondary: boolean
  educationalCategory: string
}

interface Division {
  id: number
  name: string
}

// ─── Map indicator options ────────────────────────────────────────────────────

const INDICATOR_OPTIONS = [
  { value: 'Base_Score',          label: 'Βάση Μορίων' },
  { value: 'Success_Count',       label: 'Αριθμός Μεταθέσεων' },
  { value: 'Leaving_Count',       label: 'Αιτήσεις Αποχώρησης' },
  { value: 'Targeting_1st_Count', label: 'Ζήτηση 1ης Προτίμησης' },
  { value: 'Difficulty_Category', label: 'Βαθμός Δυσκολίας' },
]

// ─── Custom Select ─────────────────────────────────────────────────────────────

interface SelectProps {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
  fullWidth?: boolean
}

function FilterSelect({ value, onChange, options, placeholder, className = '', fullWidth = false }: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find(o => o.value === value)
  const label = selected ? selected.label : (placeholder ?? 'Επιλογή…')

  return (
    <div ref={ref} style={{ position: 'relative', ...(fullWidth ? { width: '100%' } : {}) }} className={className}>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '9px 16px',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#0f172a',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          transition: 'background 0.2s, box-shadow 0.2s',
          ...(fullWidth ? { width: '100%', justifyContent: 'space-between' } : {}),
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.95)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.82)' }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{label}</span>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '18px',
            color: '#64748b',
            flexShrink: 0,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          zIndex: 9999,
          minWidth: '200px',
          maxHeight: '240px',
          overflowY: 'auto',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(226,232,240,0.8)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }}>
          {placeholder && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '13px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {placeholder}
            </button>
          )}
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 500,
                background: value === opt.value ? 'rgba(14,165,233,0.08)' : 'none',
                color: value === opt.value ? '#0ea5e9' : '#334155',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                if (value !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = value === opt.value ? 'rgba(14,165,233,0.08)' : 'none'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Mobile filter drawer ──────────────────────────────────────────────────────

interface MobileFiltersProps {
  open: boolean
  onClose: () => void
  // current applied values
  division: string
  specialty: string
  indicator: string
  zone: string
  // option lists
  divisionOptions: { value: string; label: string }[]
  specialtyOptions: { value: string; label: string }[]
  zoneOptions:      { value: string; label: string }[]
  // called only when "Εφαρμογή" is pressed
  onApply: (values: { division: string; specialty: string; indicator: string; zone: string }) => void
}

function MobileFilterDrawer({
  open, onClose,
  division, specialty, indicator, zone,
  divisionOptions, specialtyOptions, zoneOptions,
  onApply,
}: MobileFiltersProps) {
  // ── Pending (draft) state ────────────────────────────────────────────
  const [pDiv, setPDiv]         = useState(division)
  const [pSpec, setPSpec]       = useState(specialty)
  const [pInd, setPInd]         = useState(indicator)
  const [pZone, setPZone]       = useState(zone)

  // Sync pending values whenever drawer opens (reset to current applied values)
  useEffect(() => {
    if (open) {
      setPDiv(division)
      setPSpec(specialty)
      setPInd(indicator)
      setPZone(zone)
    }
  }, [open, division, specialty, indicator, zone])

  // When pending division changes, reset specialty if no longer valid
  const isPrimPending   = pDiv === 'Πρωτοβάθμια Γενικής' || pDiv === 'Πρωτοβάθμια Ειδικής'
  const isSecPending    = pDiv === 'Δευτεροβάθμια Γενικής' || pDiv === 'Δευτεροβάθμια Ειδικής'

  const pendingSpecOptions = specialtyOptions  // already filtered by actual division; we’ll just reset

  const handleDivChange = (v: string) => {
    setPDiv(v)
    // reset specialty when division changes
    setPSpec('')
  }

  const handleApply = () => {
    onApply({ division: pDiv, specialty: pSpec, indicator: pInd, zone: pZone })
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer — slides in from the TOP */}
      <div
        className={`fixed top-0 left-0 right-0 z-[9999] bg-white dark:bg-slate-900 rounded-b-3xl shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ padding: '20px 20px 28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Φίλτρα</h3>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '9999px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {/* Row 1 ─ Βαθμίδα */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Βαθμίδα</p>
            <FilterSelect value={pDiv} onChange={handleDivChange} options={divisionOptions} fullWidth />
          </div>
          {/* Row 1 ─ Ειδικότητα */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Ειδικότητα</p>
            <FilterSelect value={pSpec} onChange={setPSpec} options={specialtyOptions} fullWidth />
          </div>
          {/* Row 2 ─ Δείκτης */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Δείκτης</p>
            <FilterSelect value={pInd} onChange={setPInd} options={INDICATOR_OPTIONS} fullWidth />
          </div>
          {/* Row 2 ─ Περιοχή */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Περιοχή</p>
            <FilterSelect value={pZone} onChange={setPZone} options={zoneOptions} placeholder="Όλες" fullWidth />
          </div>
        </div>

        {/* Apply button — centered, compact */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleApply}
            style={{
              padding: '10px 32px',
              background: '#0ea5e9',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(14,165,233,0.35)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0284c7')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0ea5e9')}
          >
            Εφαρμογή
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Legend card ─────────────────────────────────────────────────────────────

function LegendCard({ indicator }: { indicator: string }) {
  const indicatorLabel = INDICATOR_OPTIONS.find(o => o.value === indicator)?.label ?? 'Βάση Μορίων'

  let items: { color: string, label: string }[] = []

  if (indicator === 'Base_Score') {
    items = [
      { color: '#0369a1', label: 'Πολύ Υψηλή (>100)' },
      { color: '#0ea5e9', label: 'Υψηλή (70 - 100)' },
      { color: '#38bdf8', label: 'Μέτρια (50 - 70)' },
      { color: '#7dd3fc', label: 'Χαμηλή (35 - 50)' },
      { color: '#bae6fd', label: 'Πολύ Χαμηλή (<35)' },
      { color: '#e2e8f0', label: 'Χωρίς Δεδομένα' },
    ]
  } else if (indicator === 'Difficulty_Category') {
    items = [
      { color: '#ef4444', label: 'Πολύ Δύσκολη' },
      { color: '#f97316', label: 'Δύσκολη' },
      { color: '#eab308', label: 'Μεσαία' },
      { color: '#22c55e', label: 'Εύκολη' },
      { color: '#e2e8f0', label: 'Άγνωστο' },
    ]
  } else {
    // Sequential scales for Success_Count, Leaving_Count, Targeting_1st_Count
    const labels = [
      '31+ άτομα',
      '11 έως 30 άτομα',
      '5 έως 10 άτομα',
      '2 έως 4 άτομα',
      '1 άτομο',
      '0 άτομα',
    ]

    let colors: string[] = []
    if (indicator === 'Success_Count') {
      colors = ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#e2e8f0']
    } else if (indicator === 'Leaving_Count') {
      colors = ['#9f1239', '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#e2e8f0']
    } else if (indicator === 'Targeting_1st_Count') {
      colors = ['#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e2e8f0']
    } else {
      colors = ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0']
    }

    items = labels.map((label, i) => ({ color: colors[i], label }))
  }

  return (
    <div style={{ position: 'absolute', bottom: '40px', left: '40px', zIndex: 500, pointerEvents: 'auto' }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          padding: '16px 20px',
          maxWidth: '240px',
          transition: 'all 0.3s',
        }}
      >
        <h3 style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
          {indicatorLabel}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const isMobile = useIsMobile()

  // Map state
  const [selectedZone, setSelectedZone] = useState<string | undefined>(undefined)

  // Filter state
  const [division, setDivision]     = useState('Πρωτοβάθμια Γενικής')
  const [specialty, setSpecialty]   = useState('ΠΕ70')
  const [indicator, setIndicator]   = useState('Base_Score')
  const [zone, setZone]             = useState('')

  // Filter data from DB
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([])
  const [allZones, setAllZones]             = useState<string[]>([])
  const [divisions, setDivisions]           = useState<Division[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Fetch filter data once
  useEffect(() => {
    fetch('/api/stats/filters')
      .then(r => r.json())
      .then(data => {
        setAllSpecialties(data.specialties ?? [])
        setAllZones(data.postingZones ?? [])
        setDivisions(data.divisions ?? [])
      })
      .catch(console.error)
  }, [])

  // Specialties filtered by selected division
  const isPrimary   = division === 'Πρωτοβάθμια Γενικής' || division === 'Πρωτοβάθμια Ειδικής'
  const isSecondary = division === 'Δευτεροβάθμια Γενικής' || division === 'Δευτεροβάθμια Ειδικής'

  const filteredSpecialties = allSpecialties
    .filter(s => {
      if (isPrimary)   return s.isPrimary
      if (isSecondary) return s.isSecondary
      return true
    })
    .sort((a, b) => {
      if (!isSecondary) return 0  // no sorting for primary
      const order = ['ΠΕ', 'ΤΕ', 'ΔΕ']
      const prefixOf = (code: string) => order.findIndex(p => code.startsWith(p))
      const pa = prefixOf(a.code), pb = prefixOf(b.code)
      const ga = pa === -1 ? 99 : pa
      const gb = pb === -1 ? 99 : pb
      if (ga !== gb) return ga - gb
      return a.code.localeCompare(b.code, 'el')
    })

  // When division changes, reset specialty to first available
  useEffect(() => {
    if (filteredSpecialties.length > 0) {
      const stillValid = filteredSpecialties.some(s => s.code === specialty)
      if (!stillValid) setSpecialty(filteredSpecialties[0].code)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division, allSpecialties])

  // Division options (fallback if DB not loaded yet)
  const divisionOptions = divisions.length > 0
    ? divisions.map(d => ({ value: d.name, label: d.name }))
    : [
        { value: 'Πρωτοβάθμια Γενικής', label: 'Πρωτοβάθμια Γενικής' },
        { value: 'Πρωτοβάθμια Ειδικής', label: 'Πρωτοβάθμια Ειδικής' },
        { value: 'Δευτεροβάθμια Γενικής', label: 'Δευτεροβάθμια Γενικής' },
        { value: 'Δευτεροβάθμια Ειδικής', label: 'Δευτεροβάθμια Ειδικής' },
      ]

  // Specialty options
  const specialtyOptions = filteredSpecialties.map(s => ({
    value: s.code,
    label: `${s.code} – ${s.name}`,
  }))

  // Zone options
  const zoneOptions = allZones.map(z => ({ value: z, label: z }))

  // When zone filter changes → update map selected zone
  const handleZoneFilterChange = (v: string) => {
    setZone(v)
    setSelectedZone(v || undefined)
  }

  const handleZoneClick = (zoneName: string) => {
    setSelectedZone(prev => {
      const next = prev === zoneName ? undefined : zoneName
      setZone(next ?? '')
      return next
    })
  }

  // ── Filter select components (shared between desktop & mobile)
  const filterSelects = (
    <>
      <FilterSelect
        value={division}
        onChange={v => setDivision(v)}
        options={divisionOptions}
        fullWidth={isMobile}
      />
      <FilterSelect
        value={specialty}
        onChange={v => setSpecialty(v)}
        options={specialtyOptions}
        fullWidth={isMobile}
      />
      <FilterSelect
        value={indicator}
        onChange={v => setIndicator(v)}
        options={INDICATOR_OPTIONS}
        fullWidth={isMobile}
      />
      <FilterSelect
        value={zone}
        onChange={handleZoneFilterChange}
        options={zoneOptions}
        placeholder="Όλες οι περιοχές"
        fullWidth={isMobile}
      />
    </>
  )

  return (
    <div
      className="text-slate-900 dark:text-slate-100 antialiased font-display"
      style={{ marginTop: '80px', height: 'calc(100vh - 80px)', position: 'relative', background: '#f1f5f9' }}
    >
      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        division={division}
        specialty={specialty}
        indicator={indicator}
        zone={zone}
        divisionOptions={divisionOptions}
        specialtyOptions={specialtyOptions}
        zoneOptions={zoneOptions}
        onApply={({ division: d, specialty: s, indicator: ind, zone: z }) => {
          setDivision(d)
          setSpecialty(s)
          setIndicator(ind)
          handleZoneFilterChange(z)
        }}
      />

      {/* ── Full-height Map + Overlays ─────────────────────────────────────── */}
      <main style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

        {/* Map layer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#f1f5f9' }}>
          <Suspense fallback={
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              Φόρτωση χάρτη...
            </div>
          }>
            <PostingZonesMapClient
              selectedZone={selectedZone}
              onZoneClick={handleZoneClick}
            />
          </Suspense>
        </div>

        {/* ── Floating overlay layer ────────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>

          {/* ── Floating Filter Pills — centered at top (desktop) ─────────── */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
              zIndex: 50,
            }}>
              {filterSelects}
            </div>
          )}

          {/* ── Floating "Φίλτρα" button (mobile) ────────────────────────── */}
          {isMobile && (
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              zIndex: 50,
            }}>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0ea5e9' }}>tune</span>
                Φίλτρα
              </button>
            </div>
          )}

          {/* ── Legend card (bottom-left) ────────────────────────────────── */}
          <LegendCard indicator={indicator} />

          {/* ── Regional Stats Card (right) — only when zone selected ────── */}
          {selectedZone && (
            <div
              style={{
                position: 'absolute',
                top: isMobile ? '16px' : '32px',
                right: isMobile ? '16px' : '32px',
                width: isMobile ? '280px' : '320px',
                pointerEvents: 'auto',
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(20px)', border: '1px solid rgba(226,232,240,0.5)', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, background: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>
                      Επιλεγμένη Περιοχή
                    </span>
                    <button
                      onClick={() => { setSelectedZone(undefined); setZone('') }}
                      style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                    </button>
                  </div>

                  <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{selectedZone}</h2>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Περιοχή Μετάθεσης</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Ζήτηση', note: 'Αναμονή δεδομένων' },
                      { label: 'Προσφορά', note: 'Αναμονή δεδομένων' },
                    ].map(item => (
                      <div key={item.label} style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '16px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</p>
                        <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>-</p>
                        <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>{item.note}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#475569' }}>Εκτίμηση Βάσης Μορίων</span>
                    <span style={{ fontWeight: 700, color: '#0ea5e9' }}>-</span>
                  </div>
                </div>

                <button
                  style={{ width: '100%', background: '#0ea5e9', color: '#fff', fontWeight: 700, padding: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0284c7')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#0ea5e9')}
                >
                  Αναλυτικά Στατιστικά
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
