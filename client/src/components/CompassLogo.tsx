interface CompassLogoProps {
  size?: string;
  className?: string;
}

export function CompassLogo({ size = "w-8 h-8", className = "" }: CompassLogoProps) {
  return (
    <div className={`${size} relative ${className}`}>
      {/* CSS Compass Logo */}
      <div className="w-full h-full rounded-full border-2 border-gradient-to-r from-[#FF5A5F] via-[#3b82f6] to-[#8b5cf6] bg-gradient-to-br from-red-50 to-purple-50 relative overflow-hidden">
        {/* Inner ring */}
        <div className="absolute inset-1 rounded-full border border-gray-300"></div>

        {/* Compass needle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-0.5 h-3 bg-gradient-to-t from-[#FF5A5F] to-[#3b82f6] rounded-full transform -translate-y-1"></div>
          <div className="w-1 h-1 bg-gradient-to-br from-[#FF5A5F] to-[#8b5cf6] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Cardinal directions - only show on larger sizes */}
        <div className="text-[6px] font-bold gradient-icon absolute top-0 left-1/2 transform -translate-x-1/2">N</div>
        <div className="text-[6px] font-bold gradient-icon absolute bottom-0 left-1/2 transform -translate-x-1/2">S</div>
        <div className="text-[6px] font-bold gradient-icon absolute right-0 top-1/2 transform -translate-y-1/2">E</div>
        <div className="text-[6px] font-bold gradient-icon absolute left-0 top-1/2 transform -translate-y-1/2">W</div>
      </div>
    </div>
  );
}