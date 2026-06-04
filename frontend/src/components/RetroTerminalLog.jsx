import { useState, useEffect } from "react";
import { Terminal, XLg } from "react-bootstrap-icons";

export const RetroTerminalLog = ({ open, onClose, productName = "Produto" }) => {
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const logSequence = [
    ">> [SISTEMA] DETECTANDO COMPOSIÇÃO DO GRUPO...",
    ">> [STATUS] MEMBROS DO GRUPO: 3/3 - META ATINGIDA!",
    ">> [AÇÃO] DISPARANDO RETRO-WEBHOOK PARA O DISCORD...",
    `>> [DISCORD] MENÇÃO ENVIADA: "Grupo fechado para ${productName.substring(0, 20)}..."`,
    ">> [GITHUB] ACIONANDO WORKFLOW DE DEPLOY DA ACTIONS...",
    ">> [GITHUB-ACTIONS] EVENTO DISPATCHED: group_closed_event",
    ">> [GITHUB-ACTIONS] REBUILD DO SITE EM ANDAMENTO... OK",
    ">> [STATUS] GRUPO ATIVADO E PREÇO PROMOCIONAL GARANTIDO!",
    ">> [SISTEMA] OPERAÇÃO CONCLUÍDA COM SUCESSO. DIVIRTA-SE!",
  ];

  useEffect(() => {
    if (!open) {
      setLines([]);
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < logSequence.length) {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, logSequence[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 800 + Math.random() * 600); // Realistic network delay

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentIndex]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[320px] sm:w-[360px] bg-black border-4 border-black text-[#00ff66] font-mono text-[9px] p-4 shadow-[6px_6px_0px_#000000] crt-scanlines leading-relaxed selection:bg-[#00ff66]/30">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-2 mb-3 select-none">
        <div className="flex items-center gap-1.5 font-bold">
          <Terminal size={12} className="animate-pulse" />
          <span>SYS_TERMINAL_LOG.EXE</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-neutral-800 p-0.5 border border-transparent hover:border-[#00ff66] text-[#00ff66] transition-colors"
        >
          <XLg size={10} />
        </button>
      </div>

      {/* Terminal lines */}
      <div className="space-y-2.5 min-h-[160px] max-h-[220px] overflow-y-auto pr-1">
        {lines.map((line, i) => (
          <div key={i} className="animate-[fadeIn_0.2s_ease-out]">
            {line}
          </div>
        ))}
        {currentIndex < logSequence.length && (
          <div className="flex items-center gap-1 text-neutral-400">
            <span className="animate-pulse">· · · executando processo</span>
            <span className="w-1.5 h-3 bg-[#00ff66] inline-block animate-pulse" />
          </div>
        )}
        {currentIndex === logSequence.length && (
          <div className="flex items-center gap-1 mt-2 text-[#00ff66] font-bold">
            <span>root@coleciona_shell:~$</span>
            <span className="w-1.5 h-3 bg-[#00ff66] inline-block animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RetroTerminalLog;
