'use client'

import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as topojson from 'topojson-client'
import L from 'leaflet'

// Fix for default Leaflet icon issues in Next.js
if (typeof window !== 'undefined') {
  // @ts-expect-error - _getIconUrl is not in the type definition but exists in Leaflet
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png'
  })
}

// Component to handle zooming to a selected feature
function MapController({ selectedFeature, geoJsonLayerRef }: { selectedFeature: GeoJSON.Feature | null, geoJsonLayerRef: React.RefObject<L.GeoJSON | null> }) {
  const map = useMap()

  useEffect(() => {
    if (selectedFeature && geoJsonLayerRef.current) {
      // Find the leaflet layer corresponding to the selected feature
      const layers = geoJsonLayerRef.current.getLayers() as L.Layer[]
      const targetLayer = layers.find((layer) => {
        const featureProp = (layer as L.Path & { feature?: GeoJSON.Feature }).feature?.properties?.zone
        return featureProp === selectedFeature.properties?.zone
      }) as L.Path | undefined
      
      if (targetLayer && 'getBounds' in targetLayer && typeof targetLayer.getBounds === 'function') {
        // Zoom and pan to the bounds of the selected feature (less intense zoom)
        
        // Define a fixed maximum zoom level that looks good for any region.
        // We use a fixed level (e.g., 8.5) so that clicking different 
        // regions sequentially doesn't keep zooming in further and further.
        const fixedMaxZoom = 8.5; 
        
        map.flyToBounds(targetLayer.getBounds(), {
          paddingBottomRight: [400, 50], // Shift left to make room for the info panel on the right
          paddingTopLeft: [50, 50], 
          maxZoom: fixedMaxZoom, // Fixed zoom level
          duration: 1.5
        })
      }
    } else if (!selectedFeature) {
      // Reset view to Greece bounds if nothing is selected (shift down slightly)
      const bounds: L.LatLngBoundsExpression = [
        [36.9, 20.5], // South West
        [41.4, 26.5]  // North East
      ]
      map.flyToBounds(bounds, { duration: 1.5 })
    }
  }, [selectedFeature, map, geoJsonLayerRef])

  return null
}

// Custom Zoom Controls Component
function CustomZoomControls() {
  const map = useMap()

  return (
    <div className="absolute bottom-8 right-8 flex flex-col gap-2 pointer-events-auto hidden md:flex" style={{ zIndex: 1000 }}>
      <button 
        onClick={(e) => { e.stopPropagation(); map.zoomIn() }}
        className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
        title="Zoom In"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); map.zoomOut() }}
        className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
        title="Zoom Out"
      >
        <span className="material-symbols-outlined">remove</span>
      </button>
    </div>
  )
}

interface PostingZonesMapProps {
  onZoneClick?: (zoneName: string, featureData?: GeoJSON.Feature) => void
  selectedZone?: string
  statistics?: any[]
  indicator?: string
  division?: string
  specialty?: string
}

export default function PostingZonesMap({ onZoneClick, selectedZone, statistics, indicator, division, specialty }: PostingZonesMapProps) {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null)
  const geoJsonLayerRef = useRef<L.GeoJSON>(null)

  // Derived state for the selected feature
  const selectedFeatureData = React.useMemo(() => {
    if (geoJsonData && selectedZone) {
      return geoJsonData.features.find(f => f.properties?.zone === selectedZone) || null
    }
    return null
  }, [geoJsonData, selectedZone])

  useEffect(() => {
    fetch('/data/posting_zones.json')
      .then((response) => response.json())
      .then((topology) => {
        const objectKey = Object.keys(topology.objects)[0]
        const geojson = topojson.feature(topology, topology.objects[objectKey]) as unknown as GeoJSON.FeatureCollection
        setGeoJsonData(geojson)
      })
      .catch((error) => {
        console.error('Error loading map data:', error)
      })
  }, [])

  const getZoneColor = (zoneName: string) => {
    if (zoneName === 'ΑΓΙΟ ΟΡΟΣ') return '#e2e8f0' // Always gray for Agio Oros
    if (!statistics || !indicator) return '#1e293b'
    const stat = statistics.find(statItem => statItem.region === zoneName)
    if (!stat) return '#e2e8f0' // No Data

    if (indicator === 'Base_Score') {
      const val = stat.baseScore
      if (val === null || val === undefined) return '#e2e8f0'
      if (val > 100) return '#0369a1'
      if (val >= 70) return '#0ea5e9'
      if (val >= 50) return '#38bdf8'
      if (val >= 35) return '#7dd3fc'
      return '#bae6fd'
    }
    
    if (indicator === 'Difficulty_Category') {
      const val = stat.difficultyCategory
      if (val === 'Extreme') return '#ef4444' // Πολύ Δύσκολη
      if (val === 'High') return '#f97316' // Δύσκολη
      if (val === 'Moderate') return '#eab308' // Μεσαία
      if (val === 'Accessible') return '#22c55e' // Εύκολη
      return '#e2e8f0' // Unknown / Άγνωστο
    }
    
    if (indicator === 'Success_Count') {
      const val = stat.successCount ?? 0
      if (val >= 31) return '#0f766e'
      if (val >= 11) return '#14b8a6'
      if (val >= 5) return '#2dd4bf'
      if (val >= 2) return '#5eead4'
      if (val === 1) return '#99f6e4'
      return '#e2e8f0'
    }
    
    if (indicator === 'Leaving_Count') {
      const val = stat.leavingCount ?? 0
      if (val >= 31) return '#9f1239'
      if (val >= 11) return '#e11d48'
      if (val >= 5) return '#f43f5e'
      if (val >= 2) return '#fb7185'
      if (val === 1) return '#fda4af'
      return '#e2e8f0'
    }
    
    if (indicator === 'Targeting_1st_Count') {
      const val = stat.targeting1stCount ?? 0
      if (val >= 31) return '#6d28d9'
      if (val >= 11) return '#7c3aed'
      if (val >= 5) return '#8b5cf6'
      if (val >= 2) return '#a78bfa'
      if (val === 1) return '#c4b5fd'
      return '#e2e8f0'
    }
    
    return '#1e293b'
  }

  const styleFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | undefined) => {
    const zoneName = feature?.properties?.zone
    const isSelected = selectedZone === zoneName
    const baseColor = zoneName ? getZoneColor(zoneName) : '#1e293b'

    return {
      fillColor: baseColor,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#64748b' : '#334155', // Slate-500 (gray) when selected, subtle dark border otherwise
      fillOpacity: 0.85
    }
  }

  const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>, layer: L.Layer) => {
    const zoneName = feature.properties?.zone
    if (zoneName === 'ΑΓΙΟ ΟΡΟΣ') {
      // No interactive listeners for Agio Oros
      return
    }

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path
        const isSelected = selectedZone === zoneName
        
        targetLayer.setStyle({
          weight: isSelected ? 3 : 2.5,
          color: '#94a3b8', // Slate-400 for hover highlight
          fillOpacity: 0.85
        })
        targetLayer.bringToFront()
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path
        const isSelected = selectedZone === zoneName
        
        targetLayer.setStyle({
          weight: isSelected ? 3 : 1,
          color: isSelected ? '#64748b' : '#334155',
          fillOpacity: 0.85
        })
      },
      click: () => {
        if (onZoneClick && zoneName) {
          onZoneClick(zoneName, feature)
        }
      }
    })
  }

  if (!geoJsonData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-slate-500 animate-pulse font-display">Φόρτωση χάρτη...</p>
      </div>
    )
  }

  // Initial bounds set tighter for more zoom (shift down slightly)
  const bounds: L.LatLngBoundsExpression = [
    [36.9, 20.5], // South West
    [41.4, 26.5]  // North East
  ]

  return (
    <div className="w-full h-full relative z-0 bg-slate-100 dark:bg-slate-950">
      <MapContainer
        bounds={bounds}
        zoomControl={false} // Disable default zoom control as user wants custom ones
        attributionControl={false} // Disable Leaflet attribution watermarks
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: 'transparent' }} // Transparent background to blend with container
      >
        <CustomZoomControls />
        <MapController selectedFeature={selectedFeatureData} geoJsonLayerRef={geoJsonLayerRef} />
        {/* We omitted TileLayer purposely to only show the abstract GeoJSON overlay */}
        
        <GeoJSON
          key={`geojson-${selectedZone}-${indicator}-${division}-${specialty}-${statistics?.length}`} // Force re-render when filters/data change to update click handlers
          ref={geoJsonLayerRef}
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  )
}
