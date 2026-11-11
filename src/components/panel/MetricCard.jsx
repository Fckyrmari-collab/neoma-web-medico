import { METRICAS } from '../../utils/metricas.js';
import { numero } from '../../utils/formato.js';
import { BurbujaIcono, Esqueleto, Variacion } from './Comunes.jsx';
import Sparkline from './Sparkline.jsx';

/**
 * Tarjeta de una métrica: valor actual, % de cambio, nota y mini gráfica.
 * Al hacer clic, la gráfica grande de abajo muestra esa métrica.
 */
export default function MetricCard({ clave, datos, cargando, seleccionada = false, onSeleccionar }) {
  const cfg = METRICAS[clave];
  const { actual, variacion, nota, serie } = datos;
  const sinDato = actual == null;

  return (
    <section
      className={`tarjeta metrica ${seleccionada ? 'metrica--seleccionada' : ''}`}
      style={{ '--color': cfg.color }}
      role="button"
      tabIndex={0}
      aria-pressed={seleccionada}
      aria-label={`Ver tendencia de ${cfg.titulo}`}
      onClick={onSeleccionar}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSeleccionar?.())}
    >
      <div className="metrica__cabecera">
        <BurbujaIcono clave={clave} color={cfg.color} />
        <h3 className="etiqueta">{cfg.titulo}</h3>
        <Variacion valor={variacion} subirEsMalo={cfg.subirEsMalo} />
      </div>

      <div className="metrica__valor">
        {cargando ? (
          <Esqueleto ancho={90} alto={34} />
        ) : (
          <>
            <strong className={`mono ${sinDato ? 'sin-dato' : ''}`}>{numero(actual, cfg.decimales)}</strong>
            <span>{cfg.unidad}</span>
          </>
        )}
      </div>
      <p className="metrica__nota">{cargando ? <Esqueleto ancho="50%" alto={10} /> : nota ?? 'Esperando datos del dispositivo'}</p>

      <Sparkline serie={serie} color={cfg.color} />
    </section>
  );
}
