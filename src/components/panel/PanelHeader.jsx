import { IconDescarga, IconReloj } from '../Icons.jsx';
import { iniciales } from '../../utils/validators.js';
import { hora, SIN_DATO } from '../../utils/formato.js';

export const PESTANAS = [
  { id: 'ia', nombre: 'NEOMA AI' },
  { id: 'general', nombre: 'Información General' },
  { id: 'historia', nombre: 'Historia Clínica' },
  { id: 'medicamentos', nombre: 'Medicamentos' },
];

/** Encabezado fijo: marca, datos del paciente, dispositivo, PDF, cerrar sesión y pestañas. */
export default function PanelHeader({ paciente, perfil, dispositivo, pestana, onPestana, puedeExportar, onCerrarSesion }) {
  const sincronizado = !!dispositivo?.ultimaSincronizacion;

  return (
    <header className="ph">
      <div className="ph__fila contenedor">
        <div className="ph__izq">
          <a className="ph__marca" href="./" aria-label="NEOMA">
            <img src="./logo/neoma-simbolo.png" alt="" />
            <span>NEOMA</span>
          </a>
          <span className="ph__separador" aria-hidden="true" />
          <div className="ph__paciente">
            <span className="ph__avatar" aria-hidden="true">{iniciales(paciente.nombre)}</span>
            <div>
              <strong>{paciente.nombre}</strong>
              <span className="ph__meta">
                <span>{perfil?.edad != null ? `${perfil.edad} años` : `${SIN_DATO} años`}</span>
                <span>{perfil?.sexo ?? SIN_DATO}</span>
                <span>{paciente.tipoDocumento} {paciente.documento}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="ph__der">
          <span className="ph__dispositivo">
            <IconReloj width={13} height={13} />
            {dispositivo?.nombre ?? 'Sin dispositivo'}
          </span>
          <span className={`ph__sync ${sincronizado ? 'ph__sync--ok' : ''}`}>
            <span className="ph__punto" aria-hidden="true" />
            {sincronizado ? `Sincronizado · ${hora(dispositivo.ultimaSincronizacion)}` : 'Sin sincronizar'}
          </span>
          <button
            type="button"
            className="ph__pdf"
            disabled={!puedeExportar}
            title={puedeExportar ? 'Descargar reporte en PDF' : 'Disponible cuando el paciente tenga datos'}
          >
            <IconDescarga width={14} height={14} /> Reporte PDF
          </button>
          <button type="button" className="ph__salir" onClick={onCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <nav className="ph__tabs contenedor" aria-label="Secciones del paciente">
        {PESTANAS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ph__tab ${pestana === t.id ? 'ph__tab--activa' : ''}`}
            aria-current={pestana === t.id ? 'page' : undefined}
            onClick={() => onPestana(t.id)}
          >
            {t.id === 'ia' && <span className="ph__tab-punto" aria-hidden="true" />}
            {t.nombre}
          </button>
        ))}
      </nav>
    </header>
  );
}
