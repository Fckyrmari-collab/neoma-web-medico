import { METRICAS } from '../../utils/metricas.js';
import { fechaHora, numero } from '../../utils/formato.js';
import { Esqueleto } from './Comunes.jsx';

const EXTREMOS = [
  { clave: 'fcMax', metrica: 'fc', titulo: 'FC Máxima' },
  { clave: 'suenoMin', metrica: 'sueno', titulo: 'Sueño Mínimo' },
  { clave: 'spo2Min', metrica: 'spo2', titulo: 'SpO₂ Mínima' },
  { clave: 'estresMax', metrica: 'estres', titulo: 'Pico de Estrés' },
];

/** Fila inferior: valores extremos del periodo con la fecha en que ocurrieron. */
export default function ExtremosGrid({ extremos, cargando }) {
  return (
    <div className="extremos">
      {EXTREMOS.map(({ clave, metrica, titulo }) => {
        const cfg = METRICAS[metrica];
        const { valor, fecha } = extremos[clave];
        const sinDato = valor == null;
        const unidad = cfg.unidad === '%' ? '%' : ` ${cfg.unidad}`;
        return (
          <section key={clave} className="tarjeta extremo">
            <h3 className="etiqueta">{titulo}</h3>
            {cargando ? (
              <Esqueleto ancho={100} alto={26} />
            ) : (
              <strong className={`mono ${sinDato ? 'sin-dato' : ''}`} style={{ color: sinDato ? undefined : cfg.color }}>
                {numero(valor, metrica === 'spo2' ? 0 : cfg.decimales)}
                {!sinDato && unidad}
              </strong>
            )}
            <span>{fecha ? fechaHora(fecha) : 'Sin registros'}</span>
          </section>
        );
      })}
    </div>
  );
}
