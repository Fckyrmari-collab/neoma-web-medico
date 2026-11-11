import { useState } from 'react';
import { fechaTexto, porFechaDesc } from '../../utils/fechas.js';
import { IconAbajoMed, IconHistorial } from './iconos.jsx';

/** Medicamentos que el paciente ya no toma, con el motivo (se puede desplegar). */
export default function Suspendidos({ suspendidos }) {
  const [abierto, setAbierto] = useState(false);
  const lista = [...suspendidos].map((m) => ({ ...m, fecha: m.hasta ?? m.desde })).sort(porFechaDesc);

  return (
    <section className="tarjeta med-seccion">
      <button
        type="button"
        className="med-cabecera med-cabecera--boton"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        disabled={!lista.length}
      >
        <span className="med-cabecera__icono" aria-hidden="true"><IconHistorial width={16} height={16} /></span>
        <div>
          <h2>Historial de Medicamentos Suspendidos</h2>
          <span>{lista.length ? 'Tratamientos anteriores y motivo de suspensión' : 'Sin medicamentos suspendidos'}</span>
        </div>
        <span className="med-contador">{lista.length}</span>
        {lista.length > 0 && <IconAbajoMed className={`med-flecha ${abierto ? 'girada' : ''}`} width={18} height={18} />}
      </button>

      {abierto && lista.length > 0 && (
        <div className="med-tabla-envoltura">
          <table className="med-tabla">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Periodo</th>
                <th>Motivo de suspensión</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((m) => (
                <tr key={m.id}>
                  <td><b>{m.nombre}</b> {m.concentracion}</td>
                  <td>{fechaTexto(m.desde)} → {fechaTexto(m.hasta)}</td>
                  <td>{m.motivo ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
