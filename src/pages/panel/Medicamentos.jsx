import ResumenMedicamentos from '../../components/medicamentos/ResumenMedicamentos.jsx';
import ListaMedicamentos from '../../components/medicamentos/ListaMedicamentos.jsx';
import HorarioDia from '../../components/medicamentos/HorarioDia.jsx';
import Suspendidos from '../../components/medicamentos/Suspendidos.jsx';
import '../../styles/medicamentos.css';

/**
 * Pestaña "Medicamentos" (vista del médico).
 *
 *  ┌──────────────────────────────────────────────────┐
 *  │ ⚠ Alergias      │ ⚠ Interacciones detectadas      │
 *  ├────────────┬────────────┬────────────┬───────────┤
 *  │ Activos    │ Suplementos│ Adherencia │ Tomas/día │
 *  ├────────────┴────────────┴──────┬─────┴───────────┤
 *  │ Medicamentos activos (tarjetas)│ Horario del día │
 *  │                                │ mañana/tarde/   │
 *  │                                │ noche           │
 *  ├────────────────────────────────┴─────────────────┤
 *  │ Suplementos y complementos                        │
 *  ├──────────────────────────────────────────────────┤
 *  │ Historial de suspendidos (desplegable)            │
 *  └──────────────────────────────────────────────────┘
 */
export default function Medicamentos({ datos, cargando }) {
  // Si el backend no manda algún dato, se usa una lista vacía (así la página nunca se rompe)
  const meds = { activos: [], suplementos: [], suspendidos: [], interacciones: [], adherencia30d: null, ...datos.medicamentos };
  const alergias = datos.informacion?.antecedentes?.alergias ?? [];

  return (
    <div className="med">
      <ResumenMedicamentos meds={meds} alergias={alergias} cargando={cargando} />

      <div className="med-principal">
        <ListaMedicamentos items={meds.activos} variante="medicamento" cargando={cargando} />
        <HorarioDia activos={meds.activos} suplementos={meds.suplementos} />
      </div>

      <ListaMedicamentos items={meds.suplementos} variante="suplemento" cargando={cargando} />

      <Suspendidos suspendidos={meds.suspendidos} />

      <p className="med-nota">
        Vista de solo lectura · La adherencia se calcula con las tomas que el paciente confirma en su app NEOMA.
      </p>
    </div>
  );
}
