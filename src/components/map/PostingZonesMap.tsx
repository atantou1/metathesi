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
}

export default function PostingZonesMap({ onZoneClick, selectedZone }: PostingZonesMapProps) {
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

  const styleFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | undefined) => {
    const zoneName = feature?.properties?.zone
    const isSelected = selectedZone === zoneName

    return {
      fillColor: isSelected ? '#0ea5e9' : '#1e293b', // Primary color vs dark slate
      weight: 1,
      opacity: 1,
      color: isSelected ? '#ffffff' : '#334155', // White border when selected, subtle dark border otherwise
      fillOpacity: isSelected ? 0.8 : 0.4
    }
  }

  const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>, layer: L.Layer) => {
    const zoneName = feature.properties?.zone

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        if (selectedZone === zoneName) return // Don't change hover style if selected

        const targetLayer = e.target as L.Path
        targetLayer.setStyle({
          weight: 2,
          color: '#cbd5e1',
          fillOpacity: 0.6,
          fillColor: '#38bdf8' // Lighter primary on hover
        })
        targetLayer.bringToFront()
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        if (selectedZone === zoneName) return // Don't revert style if selected

        const targetLayer = e.target as L.Path
        targetLayer.setStyle({
          weight: 1,
          color: '#334155',
          fillOpacity: 0.4,
          fillColor: '#1e293b'
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
          key={`geojson-${selectedZone}`} // Re-render for style updates
          ref={geoJsonLayerRef}
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  )
}
