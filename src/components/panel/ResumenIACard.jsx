import { IconChispa, IconInfo } from '../Icons.jsx';
import { partesNegrilla } from '../../utils/formato.js';
import { Esqueleto, EstadoVacio } from './Comunes.jsx';

/** Resumen narrativo de 30 días generado por la IA (RF-011). */
export default function ResumenIACard({ resumen, cargando }) {
  return (
    <section className="tarjeta resumen" aria-labelledby="resumen-titulo">
      <div className="tarjeta__cabecera resumen__cabecera">
        <div className="resumen__titulo">
          <span className="burbuja burbuja--marca" aria-hidden="true"><IconChispa width={16} height={16} /></span>
          <div>
            <h2 id="resumen-titulo">Resumen IA — NEOMA Predictive</h2>
            <span>Análisis de datos wearable · últimos 30 días</span>
          </div>
        </div>
        {resumen?.modelo && <span className="chip-modelo">{resumen.modelo}</span>}
      </div>

      <div className="resumen__cuerpo">
        {cargando ? (
          <>
            <Esqueleto ancho="100%" />
            <Esqueleto ancho="92%" />
            <Esqueleto ancho="70%" />
          </>
        ) : resumen?.parrafos?.length ? (
          resumen.parrafos.map((p, i) => (
            <p key={i}>
              {partesNegrilla(p).map((parte, j) =>
                parte.negrilla ? <strong key={j}>{parte.texto}</strong> : <span key={j}>{parte.texto}</span>
              )}
            </p>
          ))
        ) : (
          <EstadoVacio
            icono={<IconChispa width={18} height={18} />}
            titulo="Resumen aún no generado"
            texto="NEOMA AI redactará el análisis del comportamiento biométrico del paciente cuando haya datos suficientes de su reloj."
          />
        )}
      </div>

      <div className="aviso-clinico">
        <IconInfo width={13} height={13} />
        <p>
          <strong>Aviso clínico:</strong> <em>Este análisis es generado por IA con base en datos wearable. No reemplaza
          el criterio del médico tratante y debe usarse como apoyo diagnóstico complementario únicamente.</em>
        </p>
      </div>
    </section>
  );
}
