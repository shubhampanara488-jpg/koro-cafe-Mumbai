import { DietaryType } from '../types/cafe';

interface DietaryMarkProps {
  dietary: DietaryType;
  showLabel?: boolean;
}

export function DietaryMark({ dietary, showLabel = true }: DietaryMarkProps) {
  const isVeg = dietary === DietaryType.VEG;
  const borderColor = isVeg ? 'border-[#2E6B40]' : 'border-[#8C3B2B]';
  const dotColor = isVeg ? 'bg-[#2E6B40]' : 'bg-[#8C3B2B]';

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#6B5344]">
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center w-3.5 h-3.5 border ${borderColor} rounded-[2px] shrink-0`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      </span>
      {showLabel && <span>{dietary}</span>}
    </span>
  );
}
