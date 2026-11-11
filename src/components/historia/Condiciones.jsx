import { useState } from 'react';
import { IconEstetoscopio } from '../Icons.jsx';
import { Esqueleto, EstadoVacio } from '../panel/Comunes.jsx';
import { fechaTexto, haceCuanto } from '../../utils/fechas.js';

const ESTADOS = {
  activa: { texto: 'Activa', clase: 'activa' },
  controlada: { texto: 'Controlada', clase: 'controlada' },
  remision: { texto: 'En remisión', clase: 'remision' },
};

const SEVERIDAD = { leve: 1, moderada: 2, severa: 3 };

const FILTROS = [
  { id: 'todas', texto: 'Todas' },
  { id: 'activa', texto: 'Activas' },
  { id: 'controlada', texto: 'Controladas' },
  { id: 'remision', texto: 'En remisión' },
];

/** Barritas de severidad: ▮▯▯ leve · ▮▮▯ moderada · ▮▮▮ severa */
function Severidad({ nivel }) {
  const n = SEVERIDAD[nivel] ?? 0;
  if (!n) return null;
  return (
    <span className={`hc-sev hc-sev--${nivel}`} title={`Severidad ${nivel}`}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= n ? 'on' : ''} />)}
      <span>{nivel}</span>
    </span>
  );
}

/** Enfermedades y condiciones del paciente, como tarjetas. */
export default function Condiciones({ condiciones, cargando }) {
  const [filtro, setFiltro] = useState('todas');

  // Activas primero, luego las más severas
  const orden = { activa: 0, controlada: 1, remision: 2 };
  const lista = condiciones
    .filter((c) => filtro === 'todas' || c.estado === filtro)
    .sort((a, b) => (orden[a.estado] ?? 3) - (orden[b.estado] ?? 3) || (SEVERIDAD[b.severidad] ?? 0) - (SEVERIDAD[a.severidad] ?? 0));

  return (
    <section className="tarjeta hc-condiciones" aria-labelledby="hc-cond-titulo">
      <div className="hc-cabecera">
        <span className="hc-cabecera__icono" aria-hidden="true"><IconEstetoscopio width={16} height={16} /></span>
        <div>
          <h2 id="hc-cond-titulo">Enfermedades y Condiciones</h2>
          <span>Diagnósticos con codificación CIE-10</span>
        </div>
        <div className="hc-pildoras" role="tablist" aria-label="Filtrar condiciones">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filtro === f.id}
              className={`hc-pildora ${filtro === f.id ? 'activa' : ''}`}
              onClick={() => setFiltro(f.id)}
              disabled={!condiciones.length}
            >
              {f.texto}
            </button>
          ))}
        </div>
      </div>

      {cargando ? (
        <div className="hc-cond-grid">
          {[0, 1, 2].map((i) => <Esqueleto key={i} ancho="100%" alto={120} />)}
        </div>
      ) : !condiciones.length ? (
        <EstadoVacio
          icono={<IconEstetoscopio width={18} height={18} />}
          titulo="Sin enfermedades registradas"
          texto="Aquí aparecerán los diagnósticos del paciente: enfermedades crónicas, condiciones y su tratamiento actual."
        />
      ) : !lista.length ? (
        <EstadoVacio compacto titulo="Nada en esta categoría" />
      ) : (
        <ul className="hc-cond-grid">
          {lista.map((c) => {
            const est = ESTADOS[c.estado] ?? ESTADOS.activa;
            return (
              <li key={c.id} className={`hc-cond hc-cond--${est.clase}`}>
                <div className="hc-cond__fila">
                  {c.codigo && <code>{c.codigo}</code>}
                  <span className={`hc-estado hc-estado--${est.clase}`}>{est.texto}</span>
                </div>
                <h3>{c.nombre}</h3>
                <Severidad nivel={c.severidad} />
                {c.tratamiento && (
                  <p className="hc-cond__tto">
                    <span>Tratamiento</span>
                    {c.tratamiento}
                  </p>
                )}
                <p className="hc-cond__meta">
                  Desde {fechaTexto(c.desde)}
                  {c.desde && <em> · {haceCuanto(c.desde)}</em>}
                  {c.medico && <><br />{c.medico}</>}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
