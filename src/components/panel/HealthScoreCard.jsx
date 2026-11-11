import { COMPONENTES_SCORE, METRICAS, RIESGOS } from '../../utils/metricas.js';
import { numero, SIN_DATO } from '../../utils/formato.js';
import { Esqueleto } from './Comunes.jsx';

const RADIO = 56;
const CIRC = 2 * Math.PI * RADIO;

/** Tarjeta izquierda: anillo del Health Score (0-100), desglose y mini indicadores. */
export default function HealthScoreCard({ healthScore, metricas, cargando }) {
  const { valor, riesgo, componentes } = healthScore;
  const r = RIESGOS[riesgo];
  const color = r?.color ?? 'var(--borde)';
  const progreso = valor == null ? 0 : Math.min(Math.max(valor, 0), 100) / 100;

  const minis = [
    { clave: 'fc', texto: 'FC' },
    { clave: 'spo2', texto: 'SpO₂' },
    { clave: 'estres', texto: 'Estrés' },
  ];

  return (
    <section className="tarjeta hs" aria-labelledby="hs-titulo">
      <div className="hs__cabecera">
        <h2 id="hs-titulo" className="etiqueta">Health Score</h2>
        <span className={`riesgo riesgo--${r?.clase ?? 'nd'}`}>
          <span className="riesgo__punto" />
          {r?.texto ?? 'Sin evaluar'}
        </span>
      </div>

      <div className="hs__anillo" role="img" aria-label={valor == null ? 'Health Score sin datos' : `Health Score ${valor} de 100`}>
        <svg viewBox="0 0 140 140" width="150" height="150">
          <circle cx="70" cy="70" r={RADIO} className="hs__pista" />
          <circle
            cx="70"
            cy="70"
            r={RADIO}
            className="hs__progreso"
            style={{ stroke: color, strokeDasharray: CIRC, strokeDashoffset: CIRC * (1 - progreso) }}
          />
        </svg>
        <div className="hs__valor">
          {cargando ? <Esqueleto ancho={42} alto={30} /> : <strong style={{ color: r ? color : undefined }}>{valor ?? SIN_DATO}</strong>}
          <span>/100</span>
        </div>
      </div>

      <ul className="hs__componentes">
        {COMPONENTES_SCORE.map((c) => {
          const v = componentes[c.clave];
          return (
            <li key={c.clave}>
              <div className="hs__comp-fila">
                <span>{c.nombre}</span>
                <strong style={{ color: v != null ? c.color : undefined }}>{v ?? SIN_DATO}</strong>
              </div>
              <div className="hs__barra">
                <span style={{ width: `${v ?? 0}%`, background: c.color }} />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hs__minis">
        {minis.map(({ clave, texto }) => {
          const cfg = METRICAS[clave];
          const v = metricas[clave].actual;
          return (
            <div key={clave} className="hs__mini">
              <strong className="mono" style={{ color: v != null ? cfg.color : undefined }}>
                {numero(v, cfg.decimales)}
                {v != null && ` ${cfg.unidad}`}
              </strong>
              <span>{texto}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
