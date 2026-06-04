import * as React from "react";
import { Pagination } from "@ark-ui/react/pagination";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

export const CustomPagination = ({ count, pageSize, page, onPageChange }) => {
  return (
    <Pagination.Root
      count={count}
      pageSize={pageSize}
      page={page}
      onPageChange={(details) => onPageChange(details.page)}
      className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full max-w-2xl mx-auto py-8 px-4 font-mono select-none"
    >
      {/* Previous Page Trigger */}
      <Pagination.PrevTrigger className="pixel-btn text-[9px] px-3.5 py-2.5 bg-brand text-white border-2 border-black active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none">
        <ChevronLeft size={12} className="mr-1.5" />
        Anterior
      </Pagination.PrevTrigger>

      {/* Pages Context List */}
      <Pagination.Context>
        {(api) => (
          <div className="flex items-center gap-2.5">
            {api.pages.map((page, index) => {
              if (page.type === "page") {
                const isActive = page.value === api.page;
                return (
                  <button
                    key={index}
                    onClick={() => api.setPage(page.value)}
                    className={`h-9 w-9 border-2 border-black flex items-center justify-center text-[10px] font-display transition-all shadow-[2px_2px_0px_#000000] active:translate-y-0.5 ${
                      isActive
                        ? "bg-brand text-white text-shadow-sm"
                        : "bg-[#181822] text-neutral-400 hover:text-white hover:border-brand"
                    }`}
                  >
                    {page.value}
                  </button>
                );
              } else {
                return (
                  <span
                    key={index}
                    className="h-9 w-9 flex items-center justify-center text-neutral-500 font-bold text-xs"
                  >
                    ...
                  </span>
                );
              }
            })}
          </div>
        )}
      </Pagination.Context>

      {/* Next Page Trigger */}
      <Pagination.NextTrigger className="pixel-btn text-[9px] px-3.5 py-2.5 bg-brand text-white border-2 border-black active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none">
        Próximo
        <ChevronRight size={12} className="ml-1.5" />
      </Pagination.NextTrigger>
    </Pagination.Root>
  );
};

export default CustomPagination;
