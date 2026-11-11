import { useState } from 'react';
import { Esqueleto, EstadoVacio } from '../panel/Comunes.jsx';
import TarjetaMedicamento from './TarjetaMedicamento.jsx';
import { IconHoja, IconPastilla } from './iconos.jsx';

const FILTROS = [
  { id: 'todos', texto: 'Todos' },
  { id: 'cronico', texto: 'Crónicos' },
  { id: 'temporal', texto: 'Temporales' },
];

/**
 * Lista de tarjetas.
 * variante 'medicamento' → "Medicamentos activos" con filtro Crónicos/Temporales.
 * variante 'suplemento'  → "Suplementos y complementos".
 */
export default function ListaMedicamentos({ items, variante = 'medicamento', cargando }) {
  const [filtro, setFiltro] = useState('todos');
  const esSup = variante === 'suplemento';
  const lista = esSup ? items : items.filter((m) => filtro === 'todos' || (m.tipo ?? 'cronico') === filtro);

  return (
    <section className={`tarjeta med-seccion ${esSup ? 'med-seccion--sup' : ''}`}>
      <div className="med-cabecera">
        <span className="med-cabecera__icono" aria-hidden="true">
          {esSup ? <IconHoja width={16} height={16} /> : <IconPastilla width={16} height={16} />}
        </span>
        <div>
          <h2>{esSup ? 'Suplementos y Complementos' : 'Medicamentos Activos'}</h2>
          <span>{esSup ? 'Vitaminas, minerales y otros complementos' : 'Lo que el paciente toma actualmente'}</span>
        </div>
        {!esSup && (
          <div className="med-pildoras" role="tablist" aria-label="Filtrar medicamentos">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filtro === f.id}
                className={`med-pildora ${filtro === f.id ? 'activa' : ''}`}
                onClick={() => setFiltro(f.id)}
                disabled={!items.length}
              >
                {f.texto}
              </button>
            ))}
          </div>
        )}
        {esSup && <span className="med-contador">{items.length}</span>}
      </div>

      {cargando ? (
        <div className="med-grid">
          {[0, 1].map((i) => <Esqueleto key={i} ancho="100%" alto={200} />)}
        </div>
      ) : !items.length ? (
        <EstadoVacio
          compacto={esSup}
          icono={esSup ? <IconHoja width={18} height={18} /> : <IconPastilla width={18} height={18} />}
          titulo={esSup ? 'Sin suplementos registrados' : 'Sin medicamentos activos'}
          texto={
            esSup
              ? 'Vitaminas, minerales o complementos que tome el paciente aparecerán aquí.'
              : 'Cuando el paciente registre su tratamiento en la app NEOMA verás aquí dosis, horarios y adherencia.'
          }
        />
      ) : !lista.length ? (
        <EstadoVacio compacto titulo="Nada en esta categoría" />
      ) : (
        <ul className="med-grid">
          {lista.map((m) => <TarjetaMedicamento key={m.id} med={m} variante={variante} />)}
        </ul>
      )}
    </section>
  );
}
