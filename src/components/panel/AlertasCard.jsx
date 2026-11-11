import { useState } from 'react';
import { IconCampana, IconTriangulo, IconX } from '../Icons.jsx';
import { fechaCorta } from '../../utils/formato.js';
import { BurbujaIcono, Esqueleto, EstadoVacio } from './Comunes.jsx';

// Color de cada tipo de alerta
const COLORES = {
  fc: 'var(--c-fc)',
  sueno: 'var(--c-aviso)',
  spo2: 'var(--c-aviso)',
  actividad: 'var(--c-info)',
};

/** Lista de alertas detectadas por la IA. La "×" solo la oculta de esta vista (el médico es solo lectura). */
export default function AlertasCard({ alertas, cargando }) {
  const [ocultas, setOcultas] = useState([]);
  const visibles = alertas.filter((a) => !ocultas.includes(a.id));

  return (
    <section className="tarjeta alertas" aria-labelledby="alertas-titulo">
      <div className="tarjeta__cabecera">
        <h2 id="alertas-titulo" className="alertas__titulo">
          <IconTriangulo width={15} height={15} /> Alertas Inteligentes
        </h2>
        <span className={`contador ${visibles.length ? 'contador--activo' : ''}`}>
          {visibles.length} {visibles.length === 1 ? 'activa' : 'activas'}
        </span>
      </div>

      {cargando ? (
        <div className="alertas__lista">
          {[0, 1, 2].map((i) => (
            <div key={i} className="alerta">
              <Esqueleto ancho={30} alto={30} />
              <div className="alerta__texto"><Esqueleto ancho="70%" /><Esqueleto ancho="45%" alto={10} /></div>
            </div>
          ))}
        </div>
      ) : visibles.length === 0 ? (
        <EstadoVacio
          icono={<IconCampana width={18} height={18} />}
          titulo="Sin alertas activas"
          texto="Aquí aparecerán los eventos que NEOMA AI detecte: FC elevada, hipoxia nocturna, sueño reducido o baja actividad."
        />
      ) : (
        <ul className="alertas__lista">
          {visibles.map((a) => {
            const color = COLORES[a.tipo] ?? 'var(--petroleo)';
            return (
              <li key={a.id} className="alerta">
                <BurbujaIcono clave={a.tipo} color={color} tamano={30} />
                <div className="alerta__texto">
                  <strong>{a.titulo}</strong>
                  {a.detalle && <span>{a.detalle}</span>}
                  {a.fecha && <em style={{ color }}>{fechaCorta(a.fecha)}</em>}
                </div>
                <button
                  type="button"
                  className="alerta__cerrar"
                  aria-label={`Ocultar alerta: ${a.titulo}`}
                  onClick={() => setOcultas((o) => [...o, a.id])}
                >
                  <IconX width={13} height={13} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
