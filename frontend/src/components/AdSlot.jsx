import { Megaphone } from "react-bootstrap-icons";

/**
 * Reserved advertising placements. Styled in a dark retro pixel-art theme.
 * Variants: leaderboard | native | sidebar | footer | skyscraper
 */
export const AdSlot = ({ variant = "leaderboard", className = "", children }) => {
  if (variant === "native") {
    return (
      <div
        data-testid="ad-slot-native"
        className={`relative h-full min-h-[320px] bg-[#181822] border-4 border-dashed border-black flex flex-col items-center justify-center text-center px-4 shadow-[4px_4px_0px_#000000] ${className}`}
      >
        <span className="absolute top-3 right-3 font-mono text-[8px] uppercase tracking-widest bg-black border-2 border-black px-2.5 py-0.5 text-neutral-400 font-bold">
          Patrocinado
        </span>
        {children || (
          <>
            <Megaphone className="text-brand/40 mb-3 animate-pulse" size={26} />
            <p className="font-display text-[9px] uppercase tracking-wider text-neutral-400 mb-1">
              ANUNCIE AQUI
            </p>
            <p className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
              Espaço publicitário
            </p>
          </>
        )}
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div
        data-testid="ad-slot-sidebar"
        className={`bg-[#181822] border-4 border-dashed border-black flex flex-col items-center justify-center aspect-[6/5] shadow-[4px_4px_0px_#000000] ${className}`}
      >
        {children || (
          <>
            <span className="font-display text-[8px] tracking-wider text-[#ff4d4d] mb-2 uppercase">
              ADVERTISEMENT
            </span>
            <span className="font-mono text-[9px] text-neutral-500 font-bold">
              300 × 250
            </span>
          </>
        )}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div
        data-testid="ad-slot-footer"
        className={`w-full max-w-5xl h-32 mx-auto bg-[#181822] border-4 border-black flex flex-col items-center justify-center shadow-[6px_6px_0px_#000000] ${className}`}
      >
        {children || (
          <>
            <span className="font-display text-[9px] tracking-widest text-[#ff4d4d] mb-1.5 uppercase">
              ADVERTISEMENT
            </span>
            <span className="font-mono text-[9px] text-neutral-500 font-bold">
              728 × 90
            </span>
          </>
        )}
      </div>
    );
  }

  if (variant === "skyscraper") {
    return (
      <div
        data-testid="ad-slot-skyscraper"
        className={`w-[120px] sm:w-[160px] h-[600px] bg-[#181822] border-4 border-black shadow-[6px_6px_0px_#000000] flex flex-col items-center justify-between py-12 px-3 text-center select-none relative crt-scanlines ${className}`}
      >
        <span className="font-display text-[8px] uppercase tracking-widest text-neutral-500">
          SPONSOR
        </span>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 bg-black border-2 border-brand flex items-center justify-center text-brand -rotate-6 shadow-[2px_2px_0px_#000000]">
            <Megaphone size={16} className="animate-bounce" />
          </div>
          <p className="font-display text-[9px] text-[#00ff66] uppercase mt-2 leading-relaxed">
            Seu Banner
          </p>
          <span className="font-mono text-[8px] text-neutral-500">160 × 600</span>
        </div>
        <span className="font-mono text-[8px] uppercase text-brand tracking-wider font-bold">
          [ RETRO ADS ]
        </span>
      </div>
    );
  }

  // leaderboard
  return (
    <div
      data-testid="ad-slot-leaderboard"
      className={`relative max-w-4xl w-full h-24 mx-auto bg-[#181822] border-4 border-dashed border-black flex items-center justify-center shadow-[4px_4px_0px_#000000] ${className}`}
    >
      <span className="absolute top-0 left-0 font-mono text-[8px] uppercase tracking-wider text-neutral-400 bg-black border-r-2 border-b-2 border-black px-2 py-0.5 font-bold">
        ANÚNCIO
      </span>
      {children || (
        <span className="font-display text-[9px] tracking-wider text-neutral-500 uppercase">
          Leaderboard (728 × 90)
        </span>
      )}
    </div>
  );
};

export default AdSlot;
