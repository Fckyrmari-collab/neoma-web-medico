import { useMemo, useState } from 'react';
import { IconAbajo, IconBuscar, IconCalendario, IconLugar, IconVideo } from '../Icons.jsx';
import { Esqueleto, EstadoVacio } from '../panel/Comunes.jsx';
import { aFecha, horaTexto, MESES, mesAnio, porFechaDesc } from '../../utils/fechas.js';

const ESTADOS = {
  atendida: { texto: 'Atendida', clase: 'ok' },
  programada: { texto: 'Programada', clase: 'prog' },
  cancelada: { texto: 'Cancelada', clase: 'cancel' },
};

const FILTROS = [
  { id: 'todas', texto: 'Todas' },
  { id: 'atendida', texto: 'Atendidas' },
  { id: 'programada', texto: 'Programadas' },
  { id: 'cancelada', texto: 'Canceladas' },
];

function Cita({ cita }) {
  const [abierta, setAbierta] = useState(false);
  const d = aFecha(cita.fecha);
  const estado = ESTADOS[cita.estado] ?? ESTADOS.atendida;
  const hora = horaTexto(cita.fecha);
  const tieneDetalle = Boolean(cita.diagnostico || cita.notas);

  return (
    <li className={`hc-cita hc-cita--${estado.clase}`}>
      <div className="hc-cita__fecha" aria-hidden="true">
        <strong>{d.getDate()}</strong>
        <span>{MESES[d.getMonth()]}</span>
      </div>
      <span className="hc-cita__punto" aria-hidden="true" />

      <div className="hc-cita__tarjeta">
        <button
          type="button"
          className="hc-cita__cabecera"
          onClick={() => tieneDetalle && setAbierta((a) => !a)}
          aria-expanded={tieneDetalle ? abierta : undefined}
          disabled={!tieneDetalle}
        >
          <div className="hc-cita__principal">
            <div className="hc-cita__titulo">
              <span className="hc-especialidad">{cita.especialidad}</span>
              <span className={`hc-estado hc-estado--${estado.clase}`}>{estado.texto}</span>
            </div>
            <strong>{cita.motivo ?? 'Consulta'}</strong>
            <div className="hc-cita__meta">
              {cita.medico && <span>{cita.medico}</span>}
              {cita.institucion && <span><IconLugar width={12} height={12} /> {cita.institucion}</span>}
              <span>
                {cita.modalidad === 'virtual' ? <IconVideo width={12} height={12} /> : <IconCalendario width={12} height={12} />}
                {cita.modalidad === 'virtual' ? 'Virtual' : 'Presencial'}
                {hora && ` · ${hora}`}
              </span>
            </div>
          </div>
          {tieneDetalle && <IconAbajo className={`hc-cita__flecha ${abierta ? 'girada' : ''}`} width={16} height={16} />}
        </button>

        {abierta && (
          <div className="hc-cita__detalle">
            {cita.diagnostico && (
              <div>
                <span className="hc-mini-etiqueta">Diagnóstico</span>
                <p><code>{cita.diagnostico.codigo}</code> {cita.diagnostico.nombre}</p>
              </div>
            )}
            {cita.notas && (
              <div>
                <span className="hc-mini-etiqueta">Notas e indicaciones</span>
                <p>{cita.notas}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

/** Línea de tiempo de citas médicas, agrupada por mes, con filtros y búsqueda. */
export default function CitasMedicas({ citas, cargando }) {
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const grupos = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const lista = citas
      .filter((c) => filtro === 'todas' || c.estado === filtro)
      .filter((c) => !q || [c.especialidad, c.medico, c.motivo, c.institucion].join(' ').toLowerCase().includes(q))
      .sort(porFechaDesc);
    const mapa = new Map();
    lista.forEach((c) => {
      const k = mesAnio(c.fecha);
      if (!mapa.has(k)) mapa.set(k, []);
      mapa.get(k).push(c);
    });
    return [...mapa.entries()];
  }, [citas, filtro, busqueda]);

  return (
    <section className="tarjeta hc-citas" aria-labelledby="hc-citas-titulo">
      <div className="hc-cabecera">
        <span className="hc-cabecera__icono" aria-hidden="true"><IconCalendario width={16} height={16} /></span>
        <div>
          <h2 id="hc-citas-titulo">Citas Médicas</h2>
          <span>Historial de consultas</span>
        </div>
        <span className="hc-contador">{citas.length}</span>
      </div>

      <div className="hc-herramientas">
        <div className="hc-pildoras" role="tablist" aria-label="Filtrar citas">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filtro === f.id}
              className={`hc-pildora ${filtro === f.id ? 'activa' : ''}`}
              onClick={() => setFiltro(f.id)}
              disabled={!citas.length}
            >
              {f.texto}
            </button>
          ))}
        </div>
        <label className="hc-buscar">
          <IconBuscar width={14} height={14} />
          <input
            type="search"
            placeholder="Buscar especialidad, médico…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            disabled={!citas.length}
            aria-label="Buscar citas"
          />
        </label>
      </div>

      {cargando ? (
        <div className="hc-lista-carga">
          {[0, 1, 2].map((i) => <Esqueleto key={i} ancho="100%" alto={64} />)}
        </div>
      ) : !citas.length ? (
        <EstadoVacio
          icono={<IconCalendario width={18} height={18} />}
          titulo="Sin citas registradas"
          texto="Las consultas aparecerán aquí cuando el paciente las agende en NEOMA o se sincronicen desde su EPS."
        />
      ) : !grupos.length ? (
        <EstadoVacio compacto titulo="Sin resultados" texto="Ninguna cita coincide con el filtro o la búsqueda." />
      ) : (
        <div className="hc-linea">
          {grupos.map(([mes, lista]) => (
            <div key={mes} className="hc-grupo">
              <h3 className="hc-grupo__mes">{mes}</h3>
              <ol>{lista.map((c) => <Cita key={c.id} cita={c} />)}</ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
