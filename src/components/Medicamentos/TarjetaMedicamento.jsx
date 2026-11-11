import { aFecha, fechaTexto } from '../../utils/fechas.js';
import { IconHoja, IconPastilla, IconRelojPared } from './iconos.jsx';

const DIAS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

/** Días que faltan para terminar un tratamiento temporal. */
function diasRestantes(hasta) {
  if (!hasta) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.round((aFecha(hasta) - hoy) / 86400000);
}

/** 7 puntos: tomó ✓ (verde), no tomó ✗ (rojo), sin registro (gris). El último es hoy. */
function Adherencia7({ dias = [] }) {
  if (!dias.length) return <span className="med-adh__vacio">Sin registros de toma</span>;
  const ultimos = dias.slice(-7);
  const tomadas = ultimos.filter((d) => d === true).length;
  const registradas = ultimos.filter((d) => d != null).length;
  const hoy = new Date().getDay();

  return (
    <div className="med-adh">
      <div className="med-adh__puntos">
        {ultimos.map((d, i) => {
          const dia = DIAS[(hoy - (ultimos.length - 1 - i) + 7 * 2) % 7];
          const estado = d === true ? 'si' : d === false ? 'no' : 'nd';
          const texto = d === true ? 'tomada' : d === false ? 'no tomada' : 'sin registro';
          return (
            <span key={i} className={`med-adh__dia med-adh__dia--${estado}`} title={`${dia}: ${texto}`}>
              <i />
              <small>{dia}</small>
            </span>
          );
        })}
      </div>
      <span className="med-adh__texto">{tomadas}/{registradas || ultimos.length} días</span>
    </div>
  );
}

/**
 * Tarjeta de un medicamento o suplemento.
 * variante: 'medicamento' (verde) | 'suplemento' (menta/petróleo)
 */
export default function TarjetaMedicamento({ med, variante = 'medicamento' }) {
  const esSup = variante === 'suplemento';
  const restantes = med.tipo === 'temporal' ? diasRestantes(med.hasta) : null;

  return (
    <li className={`med-card ${esSup ? 'med-card--sup' : ''}`}>
      <div className="med-card__cabecera">
        <span className="med-card__icono" aria-hidden="true">
          {esSup ? <IconHoja width={18} height={18} /> : <IconPastilla width={18} height={18} />}
        </span>
        <div className="med-card__nombre">
          <h3>
            {med.nombre} {med.concentracion && <span>{med.concentracion}</span>}
          </h3>
          <p>{[med.forma, med.via && `vía ${med.via}`].filter(Boolean).join(' · ')}</p>
        </div>
        {esSup ? (
          med.categoria && <span className="med-tag med-tag--sup">{med.categoria}</span>
        ) : (
          <span className={`med-tag med-tag--${med.tipo === 'temporal' ? 'temporal' : 'cronico'}`}>
            {med.tipo === 'temporal' ? 'Temporal' : 'Crónico'}
          </span>
        )}
      </div>

      {/* Dosis y horario */}
      <div className="med-card__dosis">
        <div>
          <span className="med-etq">Dosis</span>
          <strong>{med.dosis ?? '—'}</strong>
          {med.frecuencia && <em>{med.frecuencia}</em>}
        </div>
        {med.horarios?.length > 0 && (
          <ul className="med-horas" aria-label="Horario">
            {med.horarios.map((h) => (
              <li key={h}><IconRelojPared width={12} height={12} /> {h}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Para qué es */}
      {(med.indicacion || med.codigo) && (
        <p className="med-card__para">
          <span className="med-etq">{esSup ? 'Motivo' : 'Indicado para'}</span>
          {med.codigo && <code>{med.codigo}</code>} {med.indicacion}
        </p>
      )}

      {med.notas && <p className="med-card__notas">{med.notas}</p>}

      {/* Adherencia de la semana */}
      <div className="med-card__adh">
        <span className="med-etq">Adherencia 7 días</span>
        <Adherencia7 dias={med.adherencia} />
      </div>

      <p className="med-card__pie">
        {med.prescritoPor && <span>{esSup ? 'Recomendado por' : 'Recetado por'} {med.prescritoPor}</span>}
        <span>
          Desde {fechaTexto(med.desde)}
          {restantes != null &&
            (restantes >= 0 ? (
              <b className={restantes <= 3 ? 'pronto' : ''}> · termina en {restantes} {restantes === 1 ? 'día' : 'días'}</b>
            ) : (
              <b className="pronto"> · tratamiento finalizado</b>
            ))}
        </span>
      </p>
    </li>
  );
}
