"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map"), { ssr: false });

export function RegionLabels() {
  return (
    <div className="col-span-12 rounded-[10px] border-l-4 border-caxias-blue bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <h2 className="mb-7 text-body-2xlg font-bold text-caxias-blue dark:text-caxias-blue-light">
        Mapa de Atendimentos por Região
      </h2>

      <Map />

      {/* Legend for Caxias regions */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-caxias-green"></div>
          <span className="text-caxias-silver-dark">Alta demanda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-caxias-silver"></div>
          <span className="text-caxias-silver-dark">Demanda normal</span>
        </div>
      </div>
    </div>
  );
}
