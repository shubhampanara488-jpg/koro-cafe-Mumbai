import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import type { CafeConfig } from '../types/cafe';

interface LocationMapPreviewProps {
  config: CafeConfig;
}

export function LocationMapPreview({ config }: LocationMapPreviewProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#EDE4D7] border border-[#3B241B]/12 min-h-[300px] sm:min-h-[340px] flex flex-col justify-between p-6">
      {/* Subtle architectural street grid SVG backdrop */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 360"
        className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none"
      >
        <rect width="600" height="360" fill="#EDE4D7" />
        <g stroke="#8A6B4F" strokeOpacity="0.22" strokeWidth="1.2" fill="none">
          <path d="M0 70 Q180 95 360 60 T600 85" />
          <path d="M0 165 Q210 140 410 175 T600 155" />
          <path d="M0 265 Q160 285 350 245 T600 270" />
          <path d="M110 0 Q95 160 135 360" />
          <path d="M275 0 Q295 180 265 360" />
          <path d="M445 0 Q425 180 465 360" />
        </g>
        <circle cx="290" cy="168" r="46" fill="#D6BFA5" fillOpacity="0.35" />
        <circle cx="290" cy="168" r="22" fill="#8A6B4F" fillOpacity="0.2" />
      </svg>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <span className="text-xs font-medium tracking-wide text-[#6B5344] bg-[#F5EFE6]/90 px-3 py-1.5 rounded-lg border border-[#3B241B]/10">
          {config.neighborhood}
        </span>
        <a
          href={config.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B241B] bg-[#FFFFFF]/95 px-3 py-1.5 rounded-lg border border-[#3B241B]/12 hover:bg-[#FFFFFF] transition-colors"
        >
          <span>Open in Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Centered Pin Marker */}
      <div className="relative z-10 my-6 flex flex-col items-center text-center">
        <div className="w-11 h-11 rounded-full bg-[#3B241B] text-[#F5EFE6] flex items-center justify-center shadow-md mb-2">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="bg-[#FFFFFF]/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-[#3B241B]/12 shadow-sm max-w-xs">
          <p className="font-serif text-base font-semibold text-[#3B241B]">{config.name}</p>
          <p className="text-xs text-[#6B5344] mt-0.5">{config.streetAddress}</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF]/92 backdrop-blur-sm px-4 py-3 rounded-xl border border-[#3B241B]/10">
        <p className="text-xs text-[#5C4436]">
          Landmark: <span className="font-medium text-[#3B241B]">{config.landmark}</span>
        </p>
        <a
          href={config.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B241B] hover:text-[#8A6B4F] transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
        </a>
      </div>
    </div>
  );
}
