'use client'

import PostingZonesMapClient from './PostingZonesMapClient'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, X, Database, SlidersHorizontal } from 'lucide-react'

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
  { value: 'Difficulty_Category', label: 'Επίπεδο Ανταγωνισμού' },
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
        className="flex items-center gap-[8px] px-4 py-[9px] bg-card/40 backdrop-blur-md border border-border/40 rounded-full text-[13px] font-semibold text-foreground cursor-pointer shadow-soft transition-all hover:bg-card/60"
        style={{
          ...(fullWidth ? { width: '100%', justifyContent: 'space-between' } : {}),
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{label}</span>
        <ChevronDown
          className="w-4 h-4 text-muted-foreground transition-transform duration-200"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-[9999] min-w-[200px] max-h-[240px] overflow-y-auto bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-floating">
          {placeholder && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className="w-full text-left px-4 py-[10px] text-[13px] text-muted-foreground bg-transparent border-none cursor-pointer"
            >
              {placeholder}
            </button>
          )}
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-4 py-[10px] text-[13px] font-medium border-none cursor-pointer transition-colors ${
                value === opt.value ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
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
        className={`fixed top-0 left-0 right-0 z-[9999] bg-white dark:bg-card rounded-b-3xl shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ padding: '20px 20px 28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 className="text-sm font-bold text-foreground">Φίλτρα</h3>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '9999px', border: 'none', background: 'none', cursor: 'pointer' }}
            className="text-text-tertiary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* National Summary — Full width at top */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => {
              window.location.href = `/stats/summary?division=${encodeURIComponent(pDiv)}&specialty=${encodeURIComponent(pSpec)}`;
              onClose();
            }}
            className="w-full h-12 flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm rounded-full cursor-pointer shadow-soft transition-all hover:bg-primary-hover active:scale-95"
          >
            Πανελλαδική Σύνοψη
          </button>
        </div>

        {/* 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {/* Row 1 ─ Βαθμίδα */}
          <div>
            <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-1">Βαθμίδα</p>
            <FilterSelect value={pDiv} onChange={handleDivChange} options={divisionOptions} fullWidth />
          </div>
          {/* Row 1 ─ Ειδικότητα */}
          <div>
            <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-1">Ειδικότητα</p>
            <FilterSelect value={pSpec} onChange={setPSpec} options={specialtyOptions} fullWidth />
          </div>
          {/* Row 2 ─ Δείκτης */}
          <div>
            <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-1">Δείκτης</p>
            <FilterSelect value={pInd} onChange={setPInd} options={INDICATOR_OPTIONS} fullWidth />
          </div>
          {/* Row 2 ─ Περιοχή */}
          <div>
            <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-1">Περιοχή</p>
            <FilterSelect value={pZone} onChange={setPZone} options={zoneOptions} placeholder="Όλες" fullWidth />
          </div>
        </div>

        {/* Apply button — centered at bottom */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleApply}
            className="w-[200px] h-10 bg-primary text-white font-bold text-sm rounded-full cursor-pointer shadow-soft transition-all hover:bg-primary-hover"
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
      { color: '#0284c7', label: 'Υψηλή (70 - 100)' },
      { color: '#0ea5e9', label: 'Μέτρια (50 - 70)' },
      { color: '#38bdf8', label: 'Χαμηλή (35 - 50)' },
      { color: '#bae6fd', label: 'Πολύ Χαμηλή (<35)' },
      { color: '#e2e8f0', label: 'Χωρίς Δεδομένα' },
    ]
  } else if (indicator === 'Difficulty_Category') {
    items = [
      { color: 'var(--danger)', label: 'Υψηλός' },
      { color: 'var(--warning)', label: 'Αυξημένος' },
      { color: 'var(--info)', label: 'Υπολογίσιμος' },
      { color: 'var(--success)', label: 'Ήπιος' },
      { color: 'var(--text-tertiary)', label: 'Χωρίς Δεδομένα' },
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
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-floating px-5 py-4 max-w-[240px] transition-all">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-[10px]">
          {indicatorLabel}
        </h3>

        <div className="flex flex-col gap-2">
          {items.map(item => (
            <div key={item.label} className="flex items-center gap-[10px]">
              <div 
                className="w-[10px] h-[10px] rounded-full shrink-0" 
                style={{ background: item.color }} 
              />
              <span className="text-[12px] font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Panel Content (Exact HTML Design) ─────────────────────────────────────────────

function PanelContent({ title, specialtyName, data, division, specialty, onClose, isMobile }: { title: string; specialtyName: string; division: string; specialty: string; data: any; onClose: () => void; isMobile: boolean }) {
  if (!data) {
    return (
      <div className="w-full bg-background h-full shadow-floating flex flex-col border-l border-border">
        <div className="p-6 border-b border-border/50 bg-card shrink-0">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{specialtyName}</p>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-primary p-1.5 rounded-xl hover:bg-primary-soft transition-colors cursor-pointer border-none bg-transparent">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground mb-4">
            <Database className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Δεν βρέθηκαν δεδομένα</h3>
          <p className="text-sm text-muted-foreground max-w-[240px]">Δεν υπάρχουν στατιστικά στοιχεία για αυτή την περιοχή με τα επιλεγμένα φίλτρα.</p>
        </div>
      </div>
    )
  }

  // Difficulty Mapping
  const diffMap: Record<string, { label: string; color: string; icon: string }> = {
    Extreme:   { label: 'Υψηλός Ανταγωνισμός', color: 'text-danger bg-danger-soft border-danger/20', icon: '🔴' },
    High:      { label: 'Αυξημένος Ανταγωνισμός',  color: 'text-warning bg-warning-soft border-warning/20', icon: '🟠' },
    Moderate:  { label: 'Υπολογίσιμος Ανταγωνισμός', color: 'text-info bg-info-soft border-info/20', icon: '🔵' },
    Accessible: { label: 'Ήπιος Ανταγωνισμός', color: 'text-success bg-success-soft border-success/20', icon: '🟢' },
    Unknown:   { label: 'Χωρίς Δεδομένα', color: 'text-text-tertiary bg-surface-dim border-border', icon: '⚪' },
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
    <div className="w-full bg-card h-full shadow-soft flex flex-col border-l border-border">
        
        <div className={`p-6 ${!isMobile ? 'pt-24' : ''} border-b border-border-dim bg-card/50 shrink-0`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-1">{specialtyName}</p>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
                </div>
                <button onClick={onClose} className="text-text-quaternary hover:text-info p-1.5 rounded-xl hover:bg-info-soft transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            {!isMobile && (
              <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm ${diff.color}`}>
                      {diff.icon} {diff.label}
                  </span>
                  <span className="text-[11px] font-semibold text-text-tertiary bg-surface-dim px-2.5 py-1.5 rounded-2xl border border-border-dim">Τάση: {trend}</span>
              </div>
            )}
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8 scrollbar-thin scrollbar-thumb-slate-300">
            
            <div className="grid grid-cols-2 gap-4">
                
                <div className="bg-card p-5 rounded-2xl border border-border shadow-soft hover:border-primary/30 hover:bg-primary-soft/30 transition-colors group">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                      Βαση Μοριων {baseYear ? `(${baseYear})` : ''}
                    </p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-foreground">{data.baseScore?.toFixed(2) || '—'}</span>
                        {data.baseScoreDiff !== null && data.baseScoreDiff !== 0 && (
                          <span className={`text-[11px] font-bold flex items-center px-1.5 py-0.5 rounded-2xl ${data.baseScoreDiff > 0 ? 'text-danger bg-danger-soft' : 'text-success bg-success-soft'}`}>
                              <svg className={`w-3 h-3 mr-0.5 ${data.baseScoreDiff < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                              {Math.abs(data.baseScoreDiff).toFixed(1)}
                          </span>
                        )}
                    </div>
                </div>

                <div className="bg-card p-5 rounded-2xl border border-border shadow-soft hover:border-primary/20 transition-colors group">
                    <p className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Ζητηση (1η Προτ.)</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-foreground">{data.targeting1stCount}</span>
                        {data.targeting1stCountDiff !== 0 && (
                          <span className={`text-[11px] font-bold flex items-center px-1.5 py-0.5 rounded-2xl ${data.targeting1stCountDiff > 0 ? 'text-success bg-success-soft' : 'text-danger bg-danger-soft'}`}>
                              <svg className={`w-3 h-3 mr-0.5 ${data.targeting1stCountDiff < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                              {Math.abs(data.targeting1stCountDiff)}
                          </span>
                        )}
                    </div>
                </div>

                <div className="col-span-2 bg-primary-soft p-5 rounded-2xl border border-primary/20 flex justify-between items-center shadow-soft">
                    <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Αριθμος Μεταθεσεων</p>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-foreground tracking-tight">{data.successCount}</span>
                            <span className="text-xs font-medium text-muted-foreground">άτομα πήραν μετάθεση</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex px-2.5 py-1.5 bg-background text-primary text-[10px] uppercase tracking-wider font-bold rounded-2xl border border-primary/10 shadow-soft">
                          Το {successYear || 2024}
                        </span>
                    </div>
                </div>
            </div>

            <hr className="border-border-dim" />

            <div>
                <h3 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-2xl bg-primary-soft text-primary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    Ποιότητα Ανταγωνισμού
                </h3>
                <div className="space-y-4">
                    <div className="bg-card p-4 rounded-2xl border border-border-dim shadow-sm">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-text-tertiary font-medium">Μ.Ο. Επιτυχόντων</span>
                            <span className="font-bold text-foreground">{data.avgScore?.toFixed(1) || '—'}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-sky-400 to-primary h-2 rounded-full shadow-inner" style={{width: `${Math.min(100, (data.avgScore || 0))}%`}}></div>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-2xl border border-border-dim shadow-sm">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-text-tertiary font-medium">Μ.Ο. Αιτούντων</span>
                            <span className="font-bold text-foreground">{data.avgScoreApplicants?.toFixed(1) || '—'}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div className="bg-text-quaternary h-2 rounded-full shadow-inner" style={{width: `${Math.min(100, (data.avgScoreApplicants || 0))}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-border-dim" />

            <div>
                <h3 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-2xl bg-primary-soft text-primary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    Ροές Μετακίνησης (Ιστορικά)
                </h3>
                <div className="grid grid-cols-2 gap-6 bg-surface-dim p-5 rounded-2xl border border-border-dim">
                    <div>
                        <p className="text-[10px] text-text-quaternary uppercase font-bold tracking-widest mb-3">Ηρθαν Απο:</p>
                        {inflow.length > 0 ? (
                          <ul className="space-y-3">
                              {inflow.slice(0, 5).map(f => (
                                <li key={f.name} className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-text-tertiary truncate mr-1" title={f.name}>{f.name}</span> 
                                    <span className="text-[10px] font-bold text-text-secondary bg-card border border-border px-2 py-0.5 rounded-2xl shadow-sm">{f.count}</span>
                                </li>
                              ))}
                          </ul>
                        ) : <p className="text-[10px] text-text-quaternary italic">Κανένα στοιχείο</p>}
                    </div>
                    <div>
                        <p className="text-[10px] text-text-quaternary uppercase font-bold tracking-widest mb-3">Θελουν να πανε:</p>
                        {outflow.length > 0 ? (
                          <ul className="space-y-3">
                            {outflow.slice(0, 5).map(f => (
                              <li key={f.name} className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-text-tertiary truncate mr-1" title={f.name}>{f.name}</span> 
                                  <span className="text-[10px] font-bold text-info bg-info-soft border border-info/20 px-2 py-0.5 rounded-2xl shadow-sm">{f.count}</span>
                              </li>
                            ))}
                          </ul>
                        ) : <p className="text-[10px] text-text-quaternary italic">Κανένα στοιχείο</p>}
                    </div>
                </div>
            </div>

        </div>

        <div className="p-6 border-t border-border-dim bg-card/80 backdrop-blur-sm shrink-0">
            <Link 
                href={`/stats/zones/${encodeURIComponent(title)}?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(specialty)}`}
                className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-floating active:scale-[0.98] cursor-pointer"
            >
                Προβολή Αναλυτικών Στατιστικών
            </Link>
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
    // Collect all current filters as a base, then override with new ones
    const currentDivision = newFilters.division || division
    const currentSpecialty = newFilters.specialty || specialty
    const currentIndicator = newFilters.indicator || indicator
    const currentZone = newFilters.zone !== undefined ? newFilters.zone : zone

    const params = new URLSearchParams()
    if (currentDivision) params.set('division', currentDivision)
    if (currentSpecialty) params.set('specialty', currentSpecialty)
    if (currentIndicator) params.set('indicator', currentIndicator)
    if (currentZone) params.set('zone', currentZone)

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
  const uniqueDivisionNames = Array.from(new Set(divisions.map(d => d.name)))
  const divisionOptions = uniqueDivisionNames.length > 0
    ? uniqueDivisionNames.map(name => ({ value: name, label: name }))
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
  const uniqueZones = Array.from(new Set(allZones))
  const zoneOptions = uniqueZones.map(z => ({ value: z, label: z }))

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
      className="text-foreground dark:text-foreground antialiased bg-background"
      style={{ height: '100vh', position: 'relative' }}
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
        <div className="absolute inset-0 z-0 bg-background" style={{ position: 'absolute', pointerEvents: 'auto' }}>
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center text-text-tertiary">
              Φόρτωση χάρτη...
            </div>
          }>
            <PostingZonesMapClient
              selectedZone={selectedZone}
              onZoneClick={handleZoneClick}
              statistics={statistics}
              indicator={indicator}
              division={division}
              specialty={specialty}
            />
          </Suspense>
        </div>

        {/* ── Floating overlay layer ────────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>

          {/* ── Floating Filter Pills — centered at top (desktop) ─────────── */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              rowGap: '12px',
              pointerEvents: 'auto',
              zIndex: 50,
              width: '100%',
              maxWidth: selectedZone ? 'calc(100vw - 480px)' : 'calc(100vw - 40px)',
              padding: '0 20px',
              transition: 'all 0.3s ease-in-out',
            }}>
              {filterSelects}
              
              <div style={{ height: '32px', width: '1px', background: 'rgba(203,213,225,0.5)', margin: '0 4px' }} />
              
              <button
                type="button"
                onClick={() => router.push(`/stats/summary?division=${encodeURIComponent(division)}&specialty=${encodeURIComponent(specialty)}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(3, 105, 161, 0.95)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(3,105,161,0.25)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(3, 105, 161, 0.8)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(3,105,161,0.2)'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  background: 'rgba(3, 105, 161, 0.8)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(3,105,161,0.2)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Πανελλαδική Σύνοψη</span>
              </button>
            </div>
          )}

          {/* ── Floating "Φίλτρα" button (mobile) ────────────────────────── */}
          {isMobile && (
            <div style={{
              position: 'absolute',
              top: '96px',
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
                  background: 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                Φίλτρα
              </button>
            </div>
          )}

          {/* ── Legend card (bottom-left) ────────────────────────────────── */}
          {(!isMobile || !selectedZone) && <LegendCard indicator={indicator} />}

        {/* ── Desktop Side Panel (Right) ─────────────────────────────────── */}
          {!isMobile && (
            <div 
              className={`absolute top-0 right-0 h-full w-[448px] z-50 pt-0 transform transition-transform duration-300 ease-out flex ${selectedZone ? 'translate-x-0' : 'translate-x-full'}`}
              style={{ pointerEvents: selectedZone ? 'auto' : 'none' }}
            >
              <PanelContent 
                title={selectedZone || lastSelectedZone} 
                specialtyName={allSpecialties.find(s => s.code === specialty)?.code + ' - ' + allSpecialties.find(s => s.code === specialty)?.name}
                division={division}
                specialty={specialty}
                data={statistics.find(s => s.region === (selectedZone || lastSelectedZone))}
                onClose={() => setZone('')} 
                isMobile={isMobile}
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
                division={division}
                specialty={specialty}
                data={statistics.find(s => s.region === (selectedZone || lastSelectedZone))}
                onClose={() => setZone('')} 
                isMobile={isMobile}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><p className="text-text-tertiary font-medium">Φόρτωση χάρτη...</p></div>}>
      <StatsMapContent />
    </Suspense>
  )
}
