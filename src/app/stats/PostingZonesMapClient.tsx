'use client'

import dynamic from 'next/dynamic'

// Leaflet relies heavily on the window object, therefore it MUST be dynamically 
// imported with SSR disabled in Next.js App Router.
const PostingZonesMap = dynamic(() => import('@/components/map/PostingZonesMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
      <div className="animate-pulse flex flex-col items-center">
        <svg className="w-10 h-10 text-slate-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-slate-500">Φόρτωση χάρτη...</p>
      </div>
    </div>
  )
})

interface PostingZonesMapClientProps {
  onZoneClick?: (zoneName: string, featureData?: GeoJSON.Feature) => void
  selectedZone?: string
  statistics?: any[]
  indicator?: string
  division?: string
  specialty?: string
}

export default function PostingZonesMapClient(props: PostingZonesMapClientProps) {
  return <PostingZonesMap {...props} />
}
