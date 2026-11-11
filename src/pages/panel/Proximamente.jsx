import { EstadoVacio } from '../../components/panel/Comunes.jsx';

/** Pestañas que todavía no se han construido (Información General, Historia Clínica, etc.). */
export default function Proximamente({ titulo }) {
  return (
    <section className="tarjeta proximamente">
      <EstadoVacio titulo={titulo} texto="Esta sección se construirá en la siguiente etapa." />
    </section>
  );
}
