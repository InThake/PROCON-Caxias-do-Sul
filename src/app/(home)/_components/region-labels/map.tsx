import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Neighborhood {
  id: string;
  name: string;
  x: number;
  y: number;
  population: string;
  characteristics: string;
  demandLevel: "alta" | "normal" | "baixa";
}

export default function CaxiasDoSulMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNeighborhood, setHoveredNeighborhood] =
    useState<Neighborhood | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<Neighborhood | null>(null);

  // Comprehensive list of neighborhoods with realistic positioning
  const neighborhoods: Neighborhood[] = [
    // Centro e proximidades
    {
      id: "centro",
      name: "Centro",
      x: 350,
      y: 280,
      population: "45.000",
      characteristics: "Centro comercial e administrativo",
      demandLevel: "alta",
    },
    {
      id: "exposicao",
      name: "Exposição",
      x: 380,
      y: 260,
      population: "7.000",
      characteristics: "Bairro nobre, residencial com parques",
      demandLevel: "normal",
    },
    {
      id: "sao-pelegrino",
      name: "São Pelegrino",
      x: 320,
      y: 260,
      population: "12.000",
      characteristics: "Histórico com forte comércio",
      demandLevel: "normal",
    },
    {
      id: "lourdes",
      name: "Lourdes",
      x: 350,
      y: 240,
      population: "8.000",
      characteristics: "Moderno, próximo à BR-116",
      demandLevel: "normal",
    },
    {
      id: "rio-branco",
      name: "Rio Branco",
      x: 380,
      y: 300,
      population: "15.000",
      characteristics: "Tradicional, história da cidade",
      demandLevel: "normal",
    },
    {
      id: "medianeira",
      name: "Medianeira",
      x: 330,
      y: 300,
      population: "11.000",
      characteristics: "Residencial consolidado",
      demandLevel: "normal",
    },
    {
      id: "floresta",
      name: "Floresta",
      x: 310,
      y: 280,
      population: "8.000",
      characteristics: "Área verde preservada",
      demandLevel: "normal",
    },

    // Zona Norte
    {
      id: "petropolis",
      name: "Petrópolis",
      x: 300,
      y: 200,
      population: "20.000",
      characteristics: "Bairro universitário (UCS)",
      demandLevel: "normal",
    },
    {
      id: "madureira",
      name: "Madureira",
      x: 350,
      y: 180,
      population: "10.000",
      characteristics: "Tranquilo com muito verde",
      demandLevel: "normal",
    },
    {
      id: "panazzolo",
      name: "Panazzolo",
      x: 380,
      y: 200,
      population: "9.000",
      characteristics: "Próximo ao centro, natureza",
      demandLevel: "normal",
    },
    {
      id: "cinquentenario",
      name: "Cinquentenário",
      x: 330,
      y: 160,
      population: "15.000",
      characteristics: "Residencial popular",
      demandLevel: "normal",
    },
    {
      id: "pio-x",
      name: "Pio X",
      x: 400,
      y: 180,
      population: "6.000",
      characteristics: "Bairro tranquilo",
      demandLevel: "baixa",
    },
    {
      id: "salgado-filho",
      name: "Salgado Filho",
      x: 420,
      y: 200,
      population: "8.500",
      characteristics: "Próximo ao aeroporto",
      demandLevel: "normal",
    },

    // Zona Sul
    {
      id: "santa-catarina",
      name: "Santa Catarina",
      x: 300,
      y: 340,
      population: "18.000",
      characteristics: "Misto residencial e industrial",
      demandLevel: "normal",
    },
    {
      id: "cristo-redentor",
      name: "Cristo Redentor",
      x: 350,
      y: 360,
      population: "25.000",
      characteristics: "Populoso, em expansão",
      demandLevel: "alta",
    },
    {
      id: "desvio-rizzo",
      name: "Desvio Rizzo",
      x: 400,
      y: 340,
      population: "30.000",
      characteristics: "Grande área industrial",
      demandLevel: "alta",
    },
    {
      id: "sao-jose",
      name: "São José",
      x: 330,
      y: 380,
      population: "12.000",
      characteristics: "Residencial em crescimento",
      demandLevel: "normal",
    },
    {
      id: "sanvitto",
      name: "Sanvitto",
      x: 380,
      y: 380,
      population: "7.000",
      characteristics: "Bairro residencial",
      demandLevel: "baixa",
    },
    {
      id: "pioneiro",
      name: "Pioneiro",
      x: 280,
      y: 360,
      population: "9.000",
      characteristics: "Bairro histórico",
      demandLevel: "normal",
    },
    {
      id: "jardim-eldorado",
      name: "Jardim Eldorado",
      x: 420,
      y: 360,
      population: "14.000",
      characteristics: "Área em desenvolvimento",
      demandLevel: "normal",
    },

    // Zona Leste
    {
      id: "ana-rech",
      name: "Ana Rech",
      x: 480,
      y: 250,
      population: "35.000",
      characteristics: "Distrito industrial",
      demandLevel: "alta",
    },
    {
      id: "interlagos",
      name: "Interlagos",
      x: 450,
      y: 280,
      population: "11.000",
      characteristics: "Bairro residencial",
      demandLevel: "normal",
    },
    {
      id: "kayser",
      name: "Kayser",
      x: 460,
      y: 300,
      population: "13.000",
      characteristics: "Área comercial e residencial",
      demandLevel: "normal",
    },
    {
      id: "bela-vista",
      name: "Bela Vista",
      x: 500,
      y: 280,
      population: "8.000",
      characteristics: "Vista panorâmica",
      demandLevel: "baixa",
    },
    {
      id: "sao-ciro",
      name: "São Ciro",
      x: 520,
      y: 300,
      population: "5.000",
      characteristics: "Área rural e residencial",
      demandLevel: "baixa",
    },

    // Zona Oeste
    {
      id: "planalto",
      name: "Planalto",
      x: 250,
      y: 250,
      population: "22.000",
      characteristics: "Residencial popular",
      demandLevel: "alta",
    },
    {
      id: "nossa-senhora-fatima",
      name: "N. Sra. de Fátima",
      x: 270,
      y: 280,
      population: "17.000",
      characteristics: "Bairro tradicional",
      demandLevel: "normal",
    },
    {
      id: "centenario",
      name: "Centenário",
      x: 230,
      y: 300,
      population: "12.000",
      characteristics: "Centenário da imigração",
      demandLevel: "normal",
    },
    {
      id: "sao-leopoldo",
      name: "São Leopoldo",
      x: 200,
      y: 280,
      population: "10.000",
      characteristics: "Área residencial",
      demandLevel: "normal",
    },
    {
      id: "presidente-vargas",
      name: "Presidente Vargas",
      x: 220,
      y: 320,
      population: "8.000",
      characteristics: "Bairro operário",
      demandLevel: "normal",
    },

    // Regiões mais afastadas
    {
      id: "forqueta",
      name: "Forqueta",
      x: 150,
      y: 200,
      population: "4.000",
      characteristics: "Área rural",
      demandLevel: "baixa",
    },
    {
      id: "galopolis",
      name: "Galópolis",
      x: 180,
      y: 380,
      population: "6.000",
      characteristics: "Distrito histórico",
      demandLevel: "baixa",
    },
    {
      id: "fazenda-souza",
      name: "Fazenda Souza",
      x: 550,
      y: 250,
      population: "3.000",
      characteristics: "Área rural",
      demandLevel: "baixa",
    },
    {
      id: "charqueadas",
      name: "Charqueadas",
      x: 280,
      y: 420,
      population: "5.000",
      characteristics: "Bairro afastado",
      demandLevel: "baixa",
    },

    // Bairros adicionais
    {
      id: "santo-antonio",
      name: "Santo Antônio",
      x: 370,
      y: 320,
      population: "9.000",
      characteristics: "Residencial",
      demandLevel: "normal",
    },
    {
      id: "jardim-america",
      name: "Jardim América",
      x: 410,
      y: 320,
      population: "7.500",
      characteristics: "Área verde",
      demandLevel: "normal",
    },
    {
      id: "esplanada",
      name: "Esplanada",
      x: 320,
      y: 220,
      population: "11.000",
      characteristics: "Vista da cidade",
      demandLevel: "normal",
    },
    {
      id: "monte-castelo",
      name: "Monte Castelo",
      x: 290,
      y: 320,
      population: "8.500",
      characteristics: "Elevado",
      demandLevel: "normal",
    },
    {
      id: "jardelino-ramos",
      name: "Jardelino Ramos",
      x: 430,
      y: 240,
      population: "6.000",
      characteristics: "Residencial",
      demandLevel: "baixa",
    },
    {
      id: "mariland",
      name: "Mariland",
      x: 450,
      y: 220,
      population: "5.500",
      characteristics: "Condomínios",
      demandLevel: "baixa",
    },
    {
      id: "villagio-iguatemi",
      name: "Villagio Iguatemi",
      x: 480,
      y: 320,
      population: "4.000",
      characteristics: "Área nobre nova",
      demandLevel: "baixa",
    },
  ];

  // Create city boundary path (irregular shape representing mountainous terrain)
  const cityBoundaryPath = `
    M 120,150 
    Q 200,120 300,130
    Q 400,120 500,140
    L 560,180
    Q 580,250 570,320
    L 550,380
    Q 480,420 400,430
    L 300,440
    Q 200,430 150,400
    L 120,350
    Q 100,280 110,220
    Z
  `;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Clear any existing content
    svg.selectAll("*").remove();

    // Set up dimensions
    const width = 700;
    const height = 550;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Create main group
    const g = svg.append("g");

    // Add city boundary with gradient fill
    const defs = svg.append("defs");

    // Create gradient for terrain effect
    const gradient = defs
      .append("radialGradient")
      .attr("id", "terrain-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#f8f8f8");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e8e8e8");

    // Draw city boundary
    g.append("path")
      .attr("d", cityBoundaryPath)
      .attr("fill", "url(#terrain-gradient)")
      .attr("stroke", "#666")
      .attr("stroke-width", 2)
      .attr("opacity", 0.3);

    // Add major roads (BR-116)
    g.append("path")
      .attr("d", "M 350,100 Q 350,280 350,450")
      .attr("stroke", "#999")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "5,5")
      .attr("fill", "none")
      .attr("opacity", 0.5);

    // Add neighborhoods as Voronoi cells
    const voronoi = d3.Delaunay.from(
      neighborhoods,
      (d) => d.x,
      (d) => d.y,
    ).voronoi([100, 100, 600, 500]);

    // Draw neighborhoods
    neighborhoods.forEach((d, i) => {
      const cell = voronoi.cellPolygon(i);
      if (!cell) return;

      g.append("path")
        .datum(d)
        .attr("d", `M${cell.join("L")}Z`)
        .attr("fill", () => {
          if (d.demandLevel === "alta") return "#3056D3";
          if (d.demandLevel === "baixa") return "#E8E8E8";
          return "#C8D0D8";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.8)
        .style("cursor", "pointer")
        .on("mouseenter", function (event, data) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("stroke-width", 2.5);
          setHoveredNeighborhood(data);
        })
        .on("mouseleave", function (event, data) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 0.8)
            .attr("stroke-width", 1.5);
          setHoveredNeighborhood(null);
        })
        .on("click", function (event, data) {
          setSelectedNeighborhood(data);
        });
    });

    // Add neighborhood labels
    g.selectAll("text")
      .data(neighborhoods)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("font-size", (d) => (d.demandLevel === "alta" ? "11px" : "9px"))
      .attr("font-weight", (d) => (d.demandLevel === "alta" ? "700" : "500"))
      .attr("fill", "#333")
      .style("pointer-events", "none")
      .text((d) => d.name)
      .each(function (d) {
        const bbox = this.getBBox();
        const padding = 2;

        const parentG = d3.select(this.parentNode as Element);
        parentG
          .insert("rect", () => this)
          .attr("x", bbox.x - padding)
          .attr("y", bbox.y - padding)
          .attr("width", bbox.width + padding * 2)
          .attr("height", bbox.height + padding * 2)
          .attr("fill", "white")
          .attr("fill-opacity", 0.8)
          .attr("rx", 2)
          .style("pointer-events", "none");
      });

    // Add zoom functionality
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
  }, [neighborhoods]);

  return (
    <div className="h-[700px] rounded-lg bg-gray-50 p-4">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Mapa de Atendimentos por Bairro - Caxias do Sul
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Serra Gaúcha, Rio Grande do Sul
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#3056D3]"></div>
            <span className="text-sm">Alta demanda</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#C8D0D8]"></div>
            <span className="text-sm">Demanda normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#E8E8E8]"></div>
            <span className="text-sm">Baixa demanda</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          className="h-[550px] w-full rounded-lg border border-gray-300 bg-white shadow-inner"
        />

        {/* Hover tooltip */}
        {hoveredNeighborhood && (
          <div className="absolute right-4 top-4 max-w-xs rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <h3 className="mb-2 text-lg font-bold">
              {hoveredNeighborhood.name}
            </h3>
            <p className="mb-1 text-sm text-gray-600">
              <strong>População:</strong> {hoveredNeighborhood.population}{" "}
              habitantes
            </p>
            <p className="mb-1 text-sm text-gray-600">
              <strong>Características:</strong>{" "}
              {hoveredNeighborhood.characteristics}
            </p>
            <div className="mt-2">
              <span
                className={`inline-block rounded-full px-2 py-1 text-xs ${
                  hoveredNeighborhood.demandLevel === "alta"
                    ? "bg-blue-100 text-blue-800"
                    : hoveredNeighborhood.demandLevel === "baixa"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-200 text-gray-700"
                }`}
              >
                Demanda {hoveredNeighborhood.demandLevel}
              </span>
            </div>
          </div>
        )}

        {/* Selected neighborhood modal */}
        {selectedNeighborhood && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setSelectedNeighborhood(null)}
          >
            <div
              className="max-w-md rounded-lg bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-2xl font-bold">
                {selectedNeighborhood.name}
              </h3>
              <div className="space-y-3">
                <p>
                  <strong>População:</strong> {selectedNeighborhood.population}{" "}
                  habitantes
                </p>
                <p>
                  <strong>Características:</strong>{" "}
                  {selectedNeighborhood.characteristics}
                </p>
                <p>
                  <strong>Nível de demanda:</strong>{" "}
                  {selectedNeighborhood.demandLevel === "alta"
                    ? "Alta"
                    : selectedNeighborhood.demandLevel === "baixa"
                      ? "Baixa"
                      : "Normal"}
                </p>
              </div>
              <button
                className="mt-6 rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                onClick={() => setSelectedNeighborhood(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Clique em um bairro para mais informações. Use o scroll para zoom.{" "}
        <span className="text-gray-500">
          • {neighborhoods.length} bairros mapeados
        </span>
      </div>
    </div>
  );
}
