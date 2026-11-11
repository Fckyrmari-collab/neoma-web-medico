import { IconAlerta } from '../Icons.jsx';
import { Esqueleto } from '../panel/Comunes.jsx';
import { aFecha, fechaTexto, porFechaDesc } from '../../utils/fechas.js';

/**
 * Parte superior de la Historia Clínica:
 *  - Aviso rojo de alergias (lo primero que debe ver un médico).
 *  - 4 indicadores rápidos.
 */
export default function ResumenClinico({ historia, alergias, cargando }) {
  const { condiciones, citas, ordenes, laboratorios } = historia;

  const activas = condiciones.filter((c) => c.estado === 'activa').length;
  const ultimaCita = citas.filter((c) => c.estado === 'atendida').sort(porFechaDesc)[0];
  const proxima = citas
    .filter((c) => c.estado === 'programada' && aFecha(c.fecha) >= new Date())
    .sort((a, b) => aFecha(a.fecha) - aFecha(b.fecha))[0];
  const alterados = laboratorios.filter((l) => l.resultado === 'alterado').length;

  const indicadores = [
    {
      titulo: 'Condiciones activas',
      valor: activas,
      detalle: `${condiciones.length} registradas en total`,
    },
    {
      titulo: 'Última consulta',
      valor: ultimaCita ? fechaTexto(ultimaCita.fecha) : '—',
      detalle: ultimaCita ? ultimaCita.especialidad : 'Sin consultas',
    },
    {
      titulo: 'Próxima cita',
      valor: proxima ? fechaTexto(proxima.fecha) : '—',
      detalle: proxima ? proxima.especialidad : 'Nada programado',
      destacado: true,
    },
    {
      titulo: 'Exámenes',
      valor: ordenes.length + laboratorios.length,
      detalle: alterados ? `${alterados} con resultado alterado` : 'Órdenes y laboratorios',
      alerta: alterados > 0,
    },
  ];

  return (
    <>
      {alergias.length > 0 && (
        <div className="hc-alergias" role="alert">
          <span className="hc-alergias__icono" aria-hidden="true"><IconAlerta width={16} height={16} /></span>
          <strong>Alergias:</strong>
          <ul>
            {alergias.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      )}

      <div className="hc-resumen">
        {indicadores.map((it) => (
          <section
            key={it.titulo}
            className={`tarjeta hc-kpi ${it.destacado ? 'hc-kpi--destacado' : ''} ${it.alerta ? 'hc-kpi--alerta' : ''}`}
          >
            <span className="hc-kpi__titulo">{it.titulo}</span>
            {cargando ? <Esqueleto ancho={80} alto={24} /> : <strong className="hc-kpi__valor">{it.valor}</strong>}
            <span className="hc-kpi__detalle">{it.detalle}</span>
          </section>
        ))}
      </div>
    </>
  );
}
