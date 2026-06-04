import { Megaphone } from "react-bootstrap-icons";

/**
 * Reserved advertising placements. Drop real ad markup (AdSense, affiliate
 * banners, etc.) into `children` later — the layout stays intact.
 * Variants: leaderboard | native | sidebar | footer
 */
export const AdSlot = ({ variant = "leaderboard", className = "", children }) => {
  if (variant === "native") {
    return (
      <div
        data-testid="ad-slot-native"
        className={`relative h-full min-h-[320px] bg-[#FAF8F5] border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center text-center px-4 ${className}`}
      >
        <span className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest bg-white border border-neutral-200 px-2 py-1 text-neutral-500 rounded">
          Sponsored
        </span>
        {children || (
          <>
            <Megaphone className="text-neutral-300 mb-3" size={26} />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Seu anúncio aqui
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
        className={`bg-neutral-100 border border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center aspect-[6/5] ${className}`}
      >
        {children || (
          <>
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 mb-1.5">
              ADVERTISEMENT
            </span>
            <span className="font-mono text-[10px] text-neutral-300">300 × 250</span>
          </>
        )}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div
        data-testid="ad-slot-footer"
        className={`w-full max-w-5xl h-32 mx-auto bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center ${className}`}
      >
        {children || (
          <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500">
            ADVERTISEMENT
          </span>
        )}
      </div>
    );
  }

  // leaderboard
  return (
    <div
      data-testid="ad-slot-leaderboard"
      className={`relative max-w-4xl w-full h-24 mx-auto bg-neutral-100 border border-dashed border-neutral-300 rounded-lg flex items-center justify-center ${className}`}
    >
      <span className="absolute top-0 left-0 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 bg-white/80 px-2 py-1 rounded-br">
        Advertisement
      </span>
      {children || (
        <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400">728 × 90</span>
      )}
    </div>
  );
};

export default AdSlot;
