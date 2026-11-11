import { Esqueleto } from '../panel/Comunes.jsx';
import { IconAviso, IconEscudo } from './iconos.jsx';

/** Color de la adherencia: ≥ 80 % buena, 60-79 % regular, < 60 % baja */
export function nivelAdherencia(pct) {
  if (pct == null) return { clase: 'nd', texto: 'Sin registros' };
  if (pct >= 80) return { clase: 'ok', texto: 'Buena' };
  if (pct >= 60) return { clase: 'medio', texto: 'Regular' };
  return { clase: 'baja', texto: 'Baja' };
}

const SEVERIDAD = {
  grave: { texto: 'Grave', orden: 0 },
  moderada: { texto: 'Moderada', orden: 1 },
  leve: { texto: 'Leve', orden: 2 },
};

/**
 * Parte superior de Medicamentos:
 *  1. Avisos de seguridad (alergias + interacciones).
 *  2. Cuatro indicadores.
 */
export default function ResumenMedicamentos({ meds, alergias, cargando }) {
  const { activos, suplementos, interacciones, adherencia30d } = meds;
  const tomas = [...activos, ...suplementos].reduce((n, m) => n + (m.horarios?.length ?? 0), 0);
  const nivel = nivelAdherencia(adherencia30d);
  const cronicos = activos.filter((m) => m.tipo === 'cronico').length;
  const ordenadas = [...interacciones].sort(
    (a, b) => (SEVERIDAD[a.severidad]?.orden ?? 3) - (SEVERIDAD[b.severidad]?.orden ?? 3)
  );

  const indicadores = [
    { titulo: 'Medicamentos activos', valor: activos.length, detalle: `${cronicos} de uso crónico` },
    { titulo: 'Suplementos', valor: suplementos.length, detalle: 'Vitaminas y complementos' },
    {
      titulo: 'Adherencia 30 días',
      valor: adherencia30d == null ? '—' : `${adherencia30d}%`,
      detalle: nivel.texto,
      adherencia: true,
    },
    { titulo: 'Tomas por día', valor: tomas, detalle: 'Entre medicamentos y suplementos' },
  ];

  return (
    <>
      {/* ── Avisos de seguridad ── */}
      {(alergias.length > 0 || ordenadas.length > 0) && (
        <div className="med-avisos">
          {alergias.length > 0 && (
            <div className="med-aviso med-aviso--alergia" role="alert">
              <span className="med-aviso__icono"><IconAviso width={16} height={16} /></span>
              <div>
                <strong>Alergias registradas</strong>
                <ul className="med-chips">
                  {alergias.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </div>
            </div>
          )}

          {ordenadas.length > 0 && (
            <div className="med-aviso med-aviso--interaccion" role="alert">
              <span className="med-aviso__icono"><IconAviso width={16} height={16} /></span>
              <div className="med-aviso__lista">
                <strong>
                  {ordenadas.length} {ordenadas.length === 1 ? 'interacción detectada' : 'interacciones detectadas'}
                </strong>
                {ordenadas.map((it) => (
                  <div key={it.id} className="med-interaccion">
                    <span className={`med-sev med-sev--${it.severidad}`}>{SEVERIDAD[it.severidad]?.texto ?? it.severidad}</span>
                    <div>
                      <b>{it.medicamentos.join(' + ')}</b>
                      {it.descripcion && <p>{it.descripcion}</p>}
                      {it.recomendacion && <p className="med-interaccion__rec">→ {it.recomendacion}</p>}
                    </div>
                  </div>
                ))}
                <small>Aviso de apoyo generado con una base farmacológica. La decisión final es del médico tratante.</small>
              </div>
            </div>
          )}
        </div>
      )}

      {!cargando && alergias.length === 0 && ordenadas.length === 0 && (
        <div className="med-aviso med-aviso--ok">
          <span className="med-aviso__icono"><IconEscudo width={16} height={16} /></span>
          <p><strong>Sin alertas de seguridad.</strong> No hay alergias registradas ni interacciones detectadas.</p>
        </div>
      )}

      {/* ── Indicadores ── */}
      <div className="med-resumen">
        {indicadores.map((it) => (
          <section key={it.titulo} className={`tarjeta med-kpi ${it.adherencia ? `med-kpi--adh med-kpi--${nivel.clase}` : ''}`}>
            <span className="med-kpi__titulo">{it.titulo}</span>
            {cargando ? <Esqueleto ancho={70} alto={26} /> : <strong className="med-kpi__valor">{it.valor}</strong>}
            {it.adherencia && (
              <span className="med-kpi__barra" aria-hidden="true">
                <i style={{ width: `${adherencia30d ?? 0}%` }} />
              </span>
            )}
            <span className="med-kpi__detalle">{it.detalle}</span>
          </section>
        ))}
      </div>
    </>
  );
}
