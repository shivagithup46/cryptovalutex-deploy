import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography
} from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { scaleLinear } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mock data representing inflation or trading percentages for various countries
// Mock data representing inflation or trading percentages for various countries
const data = [
  { id: 'USA', name: 'United States', value: 3.40, date: 'Jul 2026', flag: '🇺🇸' },
  { id: 'CHN', name: 'China', value: 0.50, date: 'Jul 2026', flag: '🇨🇳' },
  { id: 'IND', name: 'India', value: 4.45, date: 'Jul 2026', flag: '🇮🇳' },
  { id: 'GBR', name: 'United Kingdom', value: 10.1, date: 'Jul 2026', flag: '🇬🇧' },
  { id: 'BRA', name: 'Brazil', value: 11.89, date: 'Jul 2026', flag: '🇧🇷' },
  { id: 'AUS', name: 'Australia', value: 7.3, date: 'Jul 2026', flag: '🇦🇺' },
  { id: 'ZAF', name: 'South Africa', value: 7.8, date: 'Jul 2026', flag: '🇿🇦' },
  { id: 'CAN', name: 'Canada', value: 7.6, date: 'Jul 2026', flag: '🇨🇦' },
  { id: 'DEU', name: 'Germany', value: 10.0, date: 'Jul 2026', flag: '🇩🇪' },
  { id: 'FRA', name: 'France', value: 6.2, date: 'Jul 2026', flag: '🇫🇷' },
  { id: 'JPN', name: 'Japan', value: 3.0, date: 'Jul 2026', flag: '🇯🇵' },
  { id: 'RUS', name: 'Russia', value: 6.00, date: 'Jul 2026', flag: '🇷🇺' },
  { id: 'MEX', name: 'Mexico', value: 8.7, date: 'Jul 2026', flag: '🇲🇽' },
  { id: 'ARG', name: 'Argentina', value: 24.5, date: 'Jul 2026', flag: '🇦🇷' }
];

const legendRanges = [
  { label: '0%', min: 0, max: 3 },
  { label: '3%', min: 3, max: 7 },
  { label: '7%', min: 7, max: 12 },
  { label: '12%', min: 12, max: 25 },
  { label: '25%', min: 25, max: 100 }
];

const colorScale = scaleLinear<string>()
  .domain([0, 3, 7, 12, 25])
  .range(["#0f172a", "#1e40af", "#0284c7", "#06b6d4", "#22d3ee"]); // Deep Navy -> Blue -> Sky -> Cyan -> Neon Teal

// Helper to generate consistent pseudo-random data for countries not in our mock list
const getCountryData = (geo: any) => {
  const existing = data.find((s) => s.id === geo.id);
  if (existing) return existing;
  
  // Create a deterministic pseudo-random value between 0.1 and 25.0 based on the country ID string
  const charSum = geo.id ? (geo.id.charCodeAt(0) || 0) + (geo.id.charCodeAt(1) || 0) + (geo.id.charCodeAt(2) || 0) : 100;
  const pseudoRandomValue = (charSum % 25) + ((charSum % 10) / 10); 
  
  return {
    id: geo.id,
    name: geo.properties?.name || geo.id || 'Unknown',
    value: parseFloat(pseudoRandomValue.toFixed(2)),
    date: 'Jul 2026',
    flag: '🌍' // Generic globe for unknown countries
  };
};

const InteractiveMap: React.FC = () => {
  const [activeRange, setActiveRange] = useState<{ min: number; max: number } | null>(null);

  return (
    <div className="w-full h-full relative font-inter">
      <Tooltip id="my-tooltip" className="z-50 !bg-[#0b1426] !text-slate-50 !border !border-white/10 !rounded-xl !shadow-2xl !opacity-100 !px-4 !py-3" />
      
      <div className="w-full h-[600px] bg-[#020617] rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl flex items-center justify-center">
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 110, center: [0, 25] }} width={800} height={500} style={{ width: '100%', height: '100%' }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = getCountryData(geo);
                  let fillColor = "#0f172a"; // Default dark base
                  let isHighlighted = false;

                  if (d) {
                    fillColor = colorScale(d.value);
                    if (activeRange) {
                        isHighlighted = d.value >= activeRange.min && d.value < activeRange.max;
                    }
                  }

                  // If an active range is selected, dim countries outside the range
                  if (activeRange && !isHighlighted) {
                      fillColor = "#0f172a";
                  }

                  const tooltipContent = d && d.name !== 'Unknown' ? `
                    <div class="flex flex-col">
                      <div class="font-bold text-white text-[15px] pb-1.5 border-b border-white/10 mb-1.5">${d.name}</div>
                      <div class="text-slate-300 text-[13px]">
                        Trading Percentage: <span class="text-cyan-400 font-bold ml-1">${d.value.toFixed(2)}%</span>
                      </div>
                    </div>
                  ` : '';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#1e293b"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none", transition: "all 250ms" },
                        hover: { outline: "none", fill: "#38bdf8", cursor: "pointer" },
                        pressed: { outline: "none" },
                      }}
                      data-tooltip-id={d ? "my-tooltip" : ""}
                      data-tooltip-html={tooltipContent}
                    />
                  );
                })
              }
            </Geographies>
        </ComposableMap>

        {/* Floating Side Panels (to keep the cyberpunk feel of the original image) */}
        <div className="absolute left-8 bottom-8 flex flex-col gap-4 pointer-events-none max-md:hidden">
            <div className="bg-[#0b1426]/80 backdrop-blur border border-white/10 p-4 rounded-xl w-64 shadow-xl">
                <h4 className="text-xs text-slate-400 font-bold tracking-wider mb-4">GLOBAL FINANCIAL INDEX</h4>
                <div className="w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full mb-2"></div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                    <span>High &gt;</span>
                    <span>Moderate</span>
                    <span>Low</span>
                </div>
            </div>
            
            <div className="bg-[#0b1426]/80 backdrop-blur border border-white/10 p-4 rounded-xl w-64 shadow-xl">
                <h4 className="text-xs text-slate-400 font-bold tracking-wider mb-4">MARKET TRENDS (2024)</h4>
                <div className="h-24 w-full flex items-end justify-between gap-1">
                    {[30, 45, 25, 60, 40, 75, 55, 90, 65, 80].map((h, i) => (
                        <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group overflow-hidden" style={{height: `${h}%`}}>
                             <div className="absolute bottom-0 w-full bg-cyan-400 rounded-t-sm transition-all duration-300" style={{height: `${h*0.7}%`}}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="absolute right-8 bottom-8 flex flex-col gap-4 pointer-events-none max-md:hidden">
            <div className="bg-[#0b1426]/80 backdrop-blur border border-white/10 p-4 rounded-xl w-64 shadow-xl">
                 <h4 className="text-xs text-slate-400 font-bold tracking-wider mb-4">TOP PERFORMERS</h4>
                 <div className="space-y-3">
                     <div className="flex items-center justify-between">
                         <span className="text-sm font-medium text-slate-300">US</span>
                         <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="w-[85%] h-full bg-cyan-400"></div>
                         </div>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="text-sm font-medium text-slate-300">CHINA</span>
                         <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="w-[70%] h-full bg-blue-500"></div>
                         </div>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="text-sm font-medium text-slate-300">EU</span>
                         <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="w-[60%] h-full bg-indigo-500"></div>
                         </div>
                     </div>
                 </div>
            </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-[#0b1426]/90 backdrop-blur-md border border-white/10 p-1.5 rounded-full shadow-2xl z-10">
            {legendRanges.map((range, i) => {
                const isActive = activeRange?.min === range.min && activeRange?.max === range.max;
                return (
                <button
                    key={i}
                    onClick={() => setActiveRange(isActive ? null : range)}
                    className={`px-4 md:px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 relative group overflow-hidden ${
                        isActive 
                            ? 'text-white' 
                            : 'text-slate-400 hover:text-white'
                    }`}
                >
                    {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-cyan-500/40"></div>
                    )}
                    <span className="relative z-10">{range.label}</span>
                    
                    {/* Active Indicator Line */}
                    {isActive && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                    )}
                </button>
            )})}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
