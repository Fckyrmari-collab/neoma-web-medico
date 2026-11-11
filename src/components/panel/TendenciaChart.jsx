import { useId, useState } from 'react';
import useAncho from '../../hooks/useAncho.js';
import { aPuntos, caminoArea, caminoSuave, tramos } from '../../utils/graficas.js';
import { METRICAS, ORDEN_METRICAS } from '../../utils/metricas.js';
import { numero } from '../../utils/formato.js';
import { IconGrafica } from '../Icons.jsx';
import { BurbujaIcono, EstadoVacio } from './Comunes.jsx';

const DIAS = 30;
const ALTO = 260;
const M = { izq: 44, der: 18, arriba: 16, abajo: 30 };

/** Gráfica grande de tendencia de 30 días con pestañas FC / SpO₂ / Sueño / Estrés. */
export default function TendenciaChart({ tendencias, dispositivo, metrica, onMetrica, cargando }) {
  const [ref, ancho] = useAncho(900);
  const [hover, setHover] = useState(null);
  const id = useId().replace(/:/g, '');

  const cfg = METRICAS[metrica];
  const serie = (tendencias[metrica] ?? []).slice(-DIAS);
  const hayDatos = serie.some((v) => v != null);

  // El eje se amplía si algún valor real se sale del rango por defecto
  const maxDato = hayDatos ? Math.max(...serie.filter((v) => v != null)) : cfg.eje.max;
  const max = Math.max(cfg.eje.max, Math.ceil(maxDato / cfg.eje.paso) * cfg.eje.paso);
  const min = cfg.eje.min;
  const ticks = [];
  for (let v = min; v <= max; v += cfg.eje.paso) ticks.push(v);

  const x0 = M.izq;
  const x1 = Math.max(ancho - M.der, x0 + 10);
  const y0 = M.arriba;
  const y1 = ALTO - M.abajo;
  const escalaY = (v) => y1 - ((v - min) / (max - min)) * (y1 - y0);
  const total = Math.max(serie.length, DIAS);
  const pts = aPuntos(serie, { x0, x1, y0, y1, min, max, total });
  const xDia = (i) => x0 + ((x1 - x0) * i) / (total - 1);

  const onMover = (e) => {
    if (!hayDatos) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - x0) / (x1 - x0)) * (total - 1));
    setHover(pts[i] ? pts[i] : null);
  };

  return (
    <section className="tarjeta tendencia" aria-labelledby="tend-titulo">
      <div className="tendencia__cabecera">
        <div className="tendencia__titulo">
          <BurbujaIcono clave={metrica} color={cfg.color} />
          <div>
            <h2 id="tend-titulo">{cfg.titulo}</h2>
            <span>
              Tendencia 30 días{dispositivo?.nombre ? ` · ${dispositivo.nombre}` : ''}
            </span>
          </div>
        </div>

        <div className="segmentado" role="tablist" aria-label="Métrica de la gráfica">
          {ORDEN_METRICAS.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={metrica === k}
              className={metrica === k ? 'activo' : ''}
              style={{ '--color': METRICAS[k].color }}
              onClick={() => {
                setHover(null);
                onMetrica(k);
              }}
            >
              {METRICAS[k].corto}
            </button>
          ))}
        </div>

        <div className="leyenda" aria-hidden="true">
          <span><i className="leyenda__umbral" /> Umbral clínico</span>
          <span><i className="leyenda__real" style={{ background: cfg.color }} /> Valor real</span>
        </div>
      </div>

      <div ref={ref} className="tendencia__lienzo">
        <svg
          width={ancho}
          height={ALTO}
          onMouseMove={onMover}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label={hayDatos ? `Tendencia de ${cfg.titulo} en 30 días` : `Sin datos de ${cfg.titulo}`}
        >
          <defs>
            <linearGradient id={`a${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: cfg.color, stopOpacity: 0.12 }} />
              <stop offset="100%" style={{ stopColor: cfg.color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={x0} x2={x1} y1={escalaY(t)} y2={escalaY(t)} className="grid" />
              <text x={x0 - 12} y={escalaY(t) + 4} className="eje" textAnchor="end">{t}</text>
            </g>
          ))}
          {[5, 10, 15, 20, 25, 30].map((d) => (
            <text key={d} x={xDia(d - 1)} y={ALTO - 8} className="eje" textAnchor="middle">d{d}</text>
          ))}

          {cfg.umbral != null && hayDatos && (
            <line x1={x0} x2={x1} y1={escalaY(cfg.umbral)} y2={escalaY(cfg.umbral)} className="umbral" />
          )}

          {hayDatos &&
            tramos(pts).map((t, i) => (
              <g key={i}>
                <path d={caminoArea(t, y1)} fill={`url(#a${id})`} />
                <path d={caminoSuave(t)} fill="none" style={{ stroke: cfg.color }} strokeWidth="2" />
              </g>
            ))}

          {hover && (
            <g className="cursor">
              <line x1={hover.x} x2={hover.x} y1={y0} y2={y1} />
              <circle cx={hover.x} cy={hover.y} r="4.5" style={{ fill: cfg.color }} />
            </g>
          )}
        </svg>

        {hover && (
          <div className="tooltip" style={{ left: Math.min(hover.x, ancho - 90), top: hover.y - 46 }}>
            <strong className="mono">{numero(hover.v, cfg.decimales)} {cfg.unidad}</strong>
            <span>Día {hover.i + 1}</span>
          </div>
        )}

        {!hayDatos && !cargando && (
          <div className="tendencia__vacio">
            <EstadoVacio
              compacto
              icono={<IconGrafica width={18} height={18} />}
              titulo="Aún no hay registros de los últimos 30 días"
              texto="La tendencia aparecerá cuando el reloj del paciente sincronice sus lecturas."
            />
          </div>
        )}
      </div>
    </section>
  );
}
