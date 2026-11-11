import { useId } from 'react';
import useAncho from '../../hooks/useAncho.js';
import { aPuntos, caminoArea, caminoSuave, tramos } from '../../utils/graficas.js';

/** Mini gráfica de línea para las tarjetas de métricas. Sin datos dibuja una guía punteada. */
export default function Sparkline({ serie = [], color, alto = 46 }) {
  const [ref, ancho] = useAncho(300);
  const id = useId().replace(/:/g, '');
  const validos = serie.filter((v) => v != null);

  if (validos.length < 2) {
    return (
      <div ref={ref} className="spark spark--vacia" style={{ height: alto }}>
        <svg width={ancho} height={alto} aria-hidden="true">
          <line x1="0" x2={ancho} y1={alto / 2} y2={alto / 2} className="spark__guia" />
        </svg>
        <span>Sin lecturas</span>
      </div>
    );
  }

  const min = Math.min(...validos);
  const max = Math.max(...validos);
  const margen = (max - min || 1) * 0.6;
  const pts = aPuntos(serie, { x0: 0, x1: ancho, y0: 4, y1: alto - 4, min: min - margen, max: max + margen });

  return (
    <div ref={ref} className="spark" style={{ height: alto }}>
      <svg width={ancho} height={alto} aria-hidden="true">
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.16 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        {tramos(pts).map((t, i) => (
          <g key={i}>
            <path d={caminoArea(t, alto)} fill={`url(#g${id})`} />
            <path d={caminoSuave(t)} fill="none" style={{ stroke: color }} strokeWidth="1.6" />
          </g>
        ))}
      </svg>
    </div>
  );
}
