import ResumenClinico from '../../components/historia/ResumenClinico.jsx';
import Condiciones from '../../components/historia/Condiciones.jsx';
import Examenes from '../../components/historia/Examenes.jsx';
import CitasMedicas from '../../components/historia/CitasMedicas.jsx';
import '../../styles/historia.css';

/**
 * Pestaña "Historia Clínica" (vista del médico).
 *
 *  ┌──────────────────────────────────────────────┐
 *  │ ⚠ Alergias                                    │
 *  ├──────────┬──────────┬──────────┬─────────────┤
 *  │ Activas  │ Última   │ Próxima  │ Exámenes    │
 *  ├──────────┴──────────┴──────────┴─────────────┤
 *  │ Enfermedades y Condiciones (tarjetas)         │
 *  ├────────────────────────┬─────────────────────┤
 *  │ Exámenes y Documentos   │ Citas Médicas       │
 *  │ [Órdenes | Laboratorios]│ (línea de tiempo)   │
 *  └────────────────────────┴─────────────────────┘
 */
export default function HistoriaClinica({ datos, cargando }) {
  // Si el backend no manda algún dato, se usa una lista vacía (así la página nunca se rompe)
  const historia = { condiciones: [], citas: [], ordenes: [], laboratorios: [], ...datos.historia };
  const alergias = datos.informacion?.antecedentes?.alergias ?? [];

  return (
    <div className="hc">
      <ResumenClinico historia={historia} alergias={alergias} cargando={cargando} />

      <Condiciones condiciones={historia.condiciones} cargando={cargando} />

      <div className="hc-grid">
        <Examenes ordenes={historia.ordenes} laboratorios={historia.laboratorios} cargando={cargando} />
        <CitasMedicas citas={historia.citas} cargando={cargando} />
      </div>

      <p className="hc-nota">
        Vista de solo lectura · Los documentos son visibles para el médico y el cuidador autorizados por el paciente.
      </p>
    </div>
  );
}
