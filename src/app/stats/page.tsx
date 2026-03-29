'use client'

import PostingZonesMapClient from './PostingZonesMapClient'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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

// ─── Panel Content (Exact HTML Design) ─────────────────────────────────────────────

function PanelContent({ title, specialtyName, data, onClose }: { title: string; specialtyName: string; data: any; onClose: () => void }) {
  if (!data) {
    return (
      <div className="w-full bg-white h-full shadow-[0_8px_30px_-4px_rgba(3,105,161,0.1)] flex flex-col border-l border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-white/50 shrink-0">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{specialtyName}</p>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-sky-600 p-1.5 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
            <span className="material-symbols-outlined text-4xl">database_off</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Δεν βρέθηκαν δεδομένα</h3>
          <p className="text-sm text-slate-500 max-w-[240px]">Δεν υπάρχουν στατιστικά στοιχεία για αυτή την περιοχή με τα επιλεγμένα φίλτρα.</p>
        </div>
      </div>
    )
  }

  // Difficulty Mapping
  const diffMap: Record<string, { label: string; color: string; icon: string }> = {
    Extreme:   { label: 'Ακραία Δυσκολία', color: 'text-rose-600 bg-rose-50 border-rose-100', icon: '🔴' },
    High:      { label: 'Υψηλή Δυσκολία',  color: 'text-orange-600 bg-orange-50 border-orange-100', icon: '🟠' },
    Moderate:  { label: 'Μεσαία Δυσκολία', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: '🟡' },
    Accessible: { label: 'Εύκολη Πρόσβαση', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: '🟢' },
    Unknown:   { label: 'Άγνωστη Δυσκολία', color: 'text-slate-500 bg-slate-50 border-slate-100', icon: '⚪' },
  }
  const diff = diffMap[data.difficultyCategory] || diffMap.Unknown

  // Trend Mapping
  const trendMap: Record<string, string> = {
    Increasing: 'Αυξητική ↗',
    Stable:     'Σταθερή →',
    Decreasing: 'Φθίνουσα ↘',
  }
  const trend = trendMap[data.difficultyCategoryTrend] || 'Σταθερή →'

  // Flow Parsing
  const parseFlows = (json: any) => {
    if (!json) return []
    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json
      return Object.entries(obj).map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
    } catch { return [] }
  }
  const inflow = parseFlows(data.inflowOriginsJson)
  const outflow = parseFlows(data.outflowTargetsJson)

  // Year extraction helpers
  const getLatestYear = (historyJson: any) => {
    if (!historyJson) return null
    try {
      const history = typeof historyJson === 'string' ? JSON.parse(historyJson) : historyJson
      const years = Object.keys(history).filter(y => history[y] !== null && history[y] !== undefined).map(Number)
      return years.length > 0 ? Math.max(...years) : null
    } catch { return null }
  }

  const baseYear = getLatestYear(data.baseScoreHistory)
  const successYear = getLatestYear(data.successCountHistory)

  return (
    <div className="w-full bg-white h-full shadow-[0_8px_30px_-4px_rgba(3,105,161,0.1)] flex flex-col border-l border-slate-200">
        
        <div className="p-6 border-b border-slate-100 bg-white/50 shrink-0">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{specialtyName}</p>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-sky-600 p-1.5 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm ${diff.color}`}>
                    {diff.icon} {diff.label}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">Τάση: {trend}</span>
            </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8 scrollbar-thin scrollbar-thumb-slate-300">
            
            <div className="grid grid-cols-2 gap-4">
                
                <div className="bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm hover:border-sky-100 hover:bg-sky-50/30 transition-colors group">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-sky-600 transition-colors">
                      Βαση Μοριων {baseYear ? `(${baseYear})` : ''}
                    </p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-slate-800">{data.baseScore?.toFixed(2) || '—'}</span>
                        {data.baseScoreDiff !== null && data.baseScoreDiff !== 0 && (
                          <span className={`text-[11px] font-bold flex items-center px-1.5 py-0.5 rounded-md ${data.baseScoreDiff > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                              <svg className={`w-3 h-3 mr-0.5 ${data.baseScoreDiff < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                              {Math.abs(data.baseScoreDiff).toFixed(1)}
                          </span>
                        )}
                    </div>
                </div>

                <div className="bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm hover:border-indigo-50 transition-colors group">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">Ζητηση (1η Προτ.)</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-slate-800">{data.targeting1stCount}</span>
                        {data.targeting1stCountDiff !== 0 && (
                          <span className={`text-[11px] font-bold flex items-center px-1.5 py-0.5 rounded-md ${data.targeting1stCountDiff > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                              <svg className={`w-3 h-3 mr-0.5 ${data.targeting1stCountDiff < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                              {Math.abs(data.targeting1stCountDiff)}
                          </span>
                        )}
                    </div>
                </div>

                <div className="col-span-2 bg-sky-50 p-5 rounded-[1.25rem] border border-sky-100 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-[10px] font-bold text-[#0369a1] uppercase tracking-widest mb-1">Αριθμος Μεταθεσεων</p>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-slate-800 tracking-tight">{data.successCount}</span>
                            <span className="text-xs font-medium text-slate-500">άτομα πήραν μετάθεση</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex px-2.5 py-1.5 bg-white text-sky-700 text-[10px] uppercase tracking-wider font-bold rounded-lg border border-sky-100 shadow-sm">
                          Το {successYear || 2024}
                        </span>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-lg bg-sky-50 text-[#0369A1]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    Ποιότητα Ανταγωνισμού
                </h3>
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-500 font-medium">Μ.Ο. Επιτυχόντων</span>
                            <span className="font-bold text-slate-800">{data.avgScore?.toFixed(1) || '—'}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-sky-400 to-[#0369a1] h-2 rounded-full shadow-inner" style={{width: `${Math.min(100, (data.avgScore || 0))}%`}}></div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-500 font-medium">Μ.Ο. Αιτούντων</span>
                            <span className="font-bold text-slate-800">{data.avgScoreApplicants?.toFixed(1) || '—'}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-slate-400 h-2 rounded-full shadow-inner" style={{width: `${Math.min(100, (data.avgScoreApplicants || 0))}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-lg bg-sky-50 text-[#0369A1]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    Ροές Μετακίνησης (Ιστορικά)
                </h3>
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-[1.25rem] border border-slate-100">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Ηρθαν Απο:</p>
                        {inflow.length > 0 ? (
                          <ul className="space-y-3">
                              {inflow.slice(0, 5).map(f => (
                                <li key={f.name} className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-600 truncate mr-1" title={f.name}>{f.name}</span> 
                                    <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">{f.count}</span>
                                </li>
                              ))}
                          </ul>
                        ) : <p className="text-[10px] text-slate-400 italic">Κανένα στοιχείο</p>}
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Θελουν να πανε:</p>
                        {outflow.length > 0 ? (
                          <ul className="space-y-3">
                            {outflow.slice(0, 5).map(f => (
                              <li key={f.name} className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-slate-600 truncate mr-1" title={f.name}>{f.name}</span> 
                                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md shadow-sm">{f.count}</span>
                              </li>
                            ))}
                          </ul>
                        ) : <p className="text-[10px] text-slate-400 italic">Κανένα στοιχείο</p>}
                    </div>
                </div>
            </div>

        </div>

        <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-sm shrink-0">
            <button className="w-full bg-[#0369A1] hover:bg-[#075985] text-white px-8 py-3.5 rounded-[1.25rem] text-sm font-semibold transition-all shadow-lg shadow-sky-900/10 active:scale-[0.98] cursor-pointer">
                Προβολή Αναλυτικών Στατιστικών
            </button>
        </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

// ─── Main Page Content ────────────────────────────────────────────────────────

function StatsMapContent() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter state from URL
  const division = searchParams.get('division') || 'Πρωτοβάθμια Γενικής'
  const specialty = searchParams.get('specialty') || 'ΠΕ70'
  const indicator = searchParams.get('indicator') || 'Base_Score'
  const zone = searchParams.get('zone') || ''

  // Sync default values to URL if missing, so the URL is immediately shareable
  useEffect(() => {
    if (!searchParams.has('division') || !searchParams.has('specialty') || !searchParams.has('indicator')) {
      const params = new URLSearchParams(searchParams.toString())
      if (!params.has('division')) params.set('division', 'Πρωτοβάθμια Γενικής')
      if (!params.has('specialty')) params.set('specialty', 'ΠΕ70')
      if (!params.has('indicator')) params.set('indicator', 'Base_Score')
      router.replace(`?${params.toString()}`, { scroll: false })
    }
  }, [searchParams, router])

  // Derived zone states
  const selectedZone = zone || undefined
  const [lastSelectedZone, setLastSelectedZone] = useState<string>(zone || '')

  // URL Update helper
  const updateFilters = (newFilters: Partial<{division: string, specialty: string, indicator: string, zone: string}>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const setDivision = (v: string) => updateFilters({ division: v })
  const setSpecialty = (v: string) => updateFilters({ specialty: v })
  const setIndicator = (v: string) => updateFilters({ indicator: v })
  const setZone = (v: string) => updateFilters({ zone: v })

  // Filter data from DB
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([])
  const [allZones, setAllZones]             = useState<string[]>([])
  const [divisions, setDivisions]           = useState<Division[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Map statistics data
  const [statistics, setStatistics] = useState<any[]>([])
  const [loadingMapData, setLoadingMapData] = useState(false)

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

  // Fetch actual statistics for map depending on division and specialty
  useEffect(() => {
    if (!division || !specialty) return
    setLoadingMapData(true)
    fetch(`/api/stats/map-data?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(specialty)}`)
      .then(res => res.json())
      .then(data => {
        setStatistics(data.statistics ?? [])
      })
      .catch(console.error)
      .finally(() => {
        setLoadingMapData(false)
      })
  }, [division, specialty])

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
    if (v) setLastSelectedZone(v)
  }

  const handleZoneClick = (zoneName: string) => {
    const next = zone === zoneName ? '' : zoneName
    setZone(next)
    if (next) setLastSelectedZone(next)
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
              statistics={statistics}
              indicator={indicator}
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
          {(!isMobile || !selectedZone) && <LegendCard indicator={indicator} />}

        {/* ── Desktop Side Panel (Right) ─────────────────────────────────── */}
          {!isMobile && (
            <div 
              className={`absolute top-0 right-0 h-full w-[448px] z-50 transform transition-transform duration-300 ease-out flex ${selectedZone ? 'translate-x-0' : 'translate-x-full'}`}
              style={{ pointerEvents: selectedZone ? 'auto' : 'none' }}
            >
              <PanelContent 
                title={selectedZone || lastSelectedZone} 
                specialtyName={allSpecialties.find(s => s.code === specialty)?.code + ' - ' + allSpecialties.find(s => s.code === specialty)?.name}
                data={statistics.find(s => s.region === (selectedZone || lastSelectedZone))}
                onClose={() => setZone('')} 
              />
            </div>
          )}

          {/* ── Mobile Bottom Sheet (Bottom) ───────────────────────────────── */}
          {isMobile && (
            <div 
              className={`fixed bottom-0 left-0 right-0 shadow-[0_-8px_30px_-4px_rgba(0,0,0,0.1)] z-[9999] transform transition-transform duration-300 ease-out flex flex-col ${selectedZone ? 'translate-y-0' : 'translate-y-full'}`}
              style={{ 
                height: '50vh', 
                pointerEvents: selectedZone ? 'auto' : 'none', 
                backgroundColor: 'white',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                overflow: 'hidden'
              }}
            >
              <PanelContent 
                title={selectedZone || lastSelectedZone} 
                specialtyName={allSpecialties.find(s => s.code === specialty)?.code + ' - ' + allSpecialties.find(s => s.code === specialty)?.name}
                data={statistics.find(s => s.region === (selectedZone || lastSelectedZone))}
                onClose={() => setZone('')} 
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── Exported Page wrapper with Suspense ──────────────────────────────────────

export default function StatsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><p className="text-slate-500 font-medium">Φόρτωση χάρτη...</p></div>}>
      <StatsMapContent />
    </Suspense>
  )
}
