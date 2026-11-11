import { IconAtardecer, IconHoja, IconLunaMed, IconPastilla, IconRelojPared, IconSol } from './iconos.jsx';

const FRANJAS = [
  { id: 'manana', titulo: 'Mañana', rango: '5:00 – 11:59', Icono: IconSol, desde: 5, hasta: 12 },
  { id: 'tarde', titulo: 'Tarde', rango: '12:00 – 18:59', Icono: IconAtardecer, desde: 12, hasta: 19 },
  { id: 'noche', titulo: 'Noche', rango: '19:00 – 4:59', Icono: IconLunaMed, desde: 19, hasta: 29 },
];

/** Convierte '08:00' en número de horas (las de madrugada cuentan como noche). */
function horaNum(h) {
  const [hh, mm] = h.split(':').map(Number);
  const v = hh + (mm || 0) / 60;
  return v < 5 ? v + 24 : v;
}

/** Agenda del día: todas las tomas ordenadas por hora y agrupadas en mañana / tarde / noche. */
export default function HorarioDia({ activos, suplementos }) {
  const tomas = [
    ...activos.map((m) => ({ ...m, sup: false })),
    ...suplementos.map((m) => ({ ...m, sup: true })),
  ]
    .flatMap((m) => (m.horarios ?? []).map((h) => ({ hora: h, n: horaNum(h), med: m })))
    .sort((a, b) => a.n - b.n);

  return (
    <section className="tarjeta med-seccion med-horario">
      <div className="med-cabecera">
        <span className="med-cabecera__icono" aria-hidden="true"><IconRelojPared width={16} height={16} /></span>
        <div>
          <h2>Horario del Día</h2>
          <span>{tomas.length} {tomas.length === 1 ? 'toma programada' : 'tomas programadas'}</span>
        </div>
      </div>

      <div className="med-franjas">
        {FRANJAS.map(({ id, titulo, rango, Icono, desde, hasta }) => {
          const enFranja = tomas.filter((t) => t.n >= desde && t.n < hasta);
          return (
            <div key={id} className={`med-franja med-franja--${id}`}>
              <div className="med-franja__titulo">
                <span aria-hidden="true"><Icono width={15} height={15} /></span>
                <strong>{titulo}</strong>
                <small>{rango}</small>
                <em>{enFranja.length}</em>
              </div>
              {enFranja.length ? (
                <ul>
                  {enFranja.map((t, i) => (
                    <li key={`${t.med.id}-${t.hora}-${i}`} className={t.med.sup ? 'sup' : ''}>
                      <time>{t.hora}</time>
                      <span className="med-franja__ico" aria-hidden="true">
                        {t.med.sup ? <IconHoja width={12} height={12} /> : <IconPastilla width={12} height={12} />}
                      </span>
                      <span className="med-franja__med">
                        <b>{t.med.nombre}</b> {t.med.concentracion}
                        {t.med.dosis && <small> · {t.med.dosis}</small>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="med-franja__vacio">Sin tomas</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
