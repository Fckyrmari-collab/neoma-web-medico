import { useState } from 'react';
import {
  IconCorazon,
  IconEdificio,
  IconEstetoscopio,
  IconGota,
  IconTelefono,
  IconUsuario,
} from '../../components/Icons.jsx';
import { Esqueleto } from '../../components/panel/Comunes.jsx';
import { iniciales } from '../../utils/validators.js';
import '../../styles/informacion.css';

const SIN_DATO = '—';

const ESTADOS = {
  estable: { texto: 'Estable', clase: 'ok' },
  observacion: { texto: 'En observación', clase: 'medio' },
  critico: { texto: 'Crítico', clase: 'alto' },
};

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
  'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** '1968-03-14' → '14 de marzo de 1968' */
function fechaLarga(iso) {
  if (!iso) return null;
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

/** Edad en años a partir de la fecha de nacimiento */
function calcularEdad(iso) {
  if (!iso) return null;
  const [a, m, d] = iso.split('-').map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - a;
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) edad--;
  return edad;
}

/* ───────────── Piezas pequeñas ───────────── */

function Foto({ url, nombre }) {
  const [fallo, setFallo] = useState(false);
  return (
    <div className="ig-foto">
      {url && !fallo ? (
        <img src={url} alt={`Foto de ${nombre}`} onError={() => setFallo(true)} />
      ) : (
        <span className="ig-foto__iniciales" aria-label="Sin foto">
          {iniciales(nombre) || <IconUsuario width={34} height={34} />}
        </span>
      )}
    </div>
  );
}

function Tarjeta({ icono, titulo, children, extra }) {
  return (
    <section className="tarjeta ig-tarjeta">
      <div className="ig-tarjeta__cabecera">
        <span className="ig-tarjeta__icono" aria-hidden="true">{icono}</span>
        <h2>{titulo}</h2>
        {extra}
      </div>
      {children}
    </section>
  );
}

/** Lista de filas "etiqueta → valor" */
function Filas({ filas, cargando }) {
  return (
    <dl className="ig-filas">
      {filas.map(([etiqueta, valor]) => (
        <div key={etiqueta} className="ig-fila">
          <dt>{etiqueta}</dt>
          <dd className={valor == null ? 'ig-vacio' : ''}>
            {cargando ? <Esqueleto ancho={110} alto={12} /> : valor ?? SIN_DATO}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ListaAntecedente({ titulo, items, color }) {
  return (
    <div className="ig-antecedente" style={{ '--color': color }}>
      <h3>{titulo}</h3>
      {items.length ? (
        <ul>
          {items.map((it) => <li key={it}>{it}</li>)}
        </ul>
      ) : (
        <p className="ig-vacio">Sin registros</p>
      )}
    </div>
  );
}

/* ───────────── Pestaña ───────────── */

export default function InformacionGeneral({ paciente, datos, cargando }) {
  const info = datos.informacion;
  const nombre = info.nombreCompleto ?? paciente.nombre;
  const tipoDoc = info.tipoDocumento ?? paciente.tipoDocumento;
  const documento = info.documento ?? paciente.documento;
  const edad = calcularEdad(info.fechaNacimiento);
  const estado = ESTADOS[info.estado];
  const contacto = info.contactoEmergencia;
  const ant = info.antecedentes;

  return (
    <div className="ig">
      {/* ── Tarjeta verde con foto ── */}
      <section className="ig-hero">
        <Foto url={info.foto} nombre={nombre} />
        <div className="ig-hero__datos">
          <span className="ig-hero__etiqueta">Paciente</span>
          <h1>{nombre}</h1>
          <p>
            <span>ID: {tipoDoc} {documento}</span>
            <span>{edad != null ? `${edad} años` : `${SIN_DATO} años`}</span>
            <span>{info.genero ?? SIN_DATO}</span>
          </p>
        </div>
        <div className="ig-hero__chips">
          <span className={`ig-chip ig-chip--${estado?.clase ?? 'nd'}`}>
            <span className="ig-chip__punto" />
            Estado: {estado?.texto ?? 'Sin registro'}
          </span>
          <span className="ig-chip ig-chip--sangre">
            <IconGota width={12} height={12} />
            {info.tipoSangre ?? SIN_DATO} · Tipo de sangre
          </span>
        </div>
      </section>

      <div className="ig-grid">
        {/* ── Información personal ── */}
        <Tarjeta icono={<IconUsuario width={16} height={16} />} titulo="Información Personal">
          <Filas
            cargando={cargando}
            filas={[
              ['Nombre completo', info.nombreCompleto],
              ['Número de documento', info.documento && `${info.tipoDocumento ?? ''} ${info.documento}`.trim()],
              ['Edad', edad != null ? `${edad} años` : null],
              ['Género', info.genero],
              ['Tipo de sangre', info.tipoSangre],
              ['Fecha de nacimiento', fechaLarga(info.fechaNacimiento)],
              ['Correo electrónico', info.correo],
              ['Número de celular', info.celular],
              ['Dirección', info.direccion && [info.direccion, info.ciudad].filter(Boolean).join(', ')],
            ]}
          />
        </Tarjeta>

        <div className="ig-columna">
          {/* ── Contacto de emergencia ── */}
          <Tarjeta icono={<IconTelefono width={15} height={15} />} titulo="Contacto de Emergencia">
            <Filas
              cargando={cargando}
              filas={[
                ['Nombre', contacto.nombre],
                ['Parentesco', contacto.parentesco],
                ['Celular', contacto.celular],
              ]}
            />
          </Tarjeta>

          {/* ── Afiliación ── */}
          <Tarjeta icono={<IconEdificio width={15} height={15} />} titulo="Afiliación en Salud">
            <Filas
              cargando={cargando}
              filas={[
                ['EPS', info.eps],
                ['Régimen', info.regimen],
                ['N.º de afiliación', info.numeroAfiliacion],
              ]}
            />
          </Tarjeta>
        </div>
      </div>

      {/* ── Antecedentes clínicos ── */}
      <Tarjeta icono={<IconEstetoscopio width={16} height={16} />} titulo="Antecedentes Clínicos">
        <div className="ig-antecedentes">
          <ListaAntecedente titulo="Alergias" items={ant.alergias} color="var(--c-fc)" />
          <ListaAntecedente titulo="Enfermedades crónicas" items={ant.enfermedades} color="var(--c-estres)" />
          <ListaAntecedente titulo="Cirugías" items={ant.cirugias} color="var(--c-sueno)" />
          <ListaAntecedente titulo="Antecedentes familiares" items={ant.familiares} color="var(--petroleo)" />
        </div>
      </Tarjeta>

      <p className="ig-nota">
        <IconCorazon width={12} height={12} /> Información registrada por el paciente en su app NEOMA · Vista de solo
        lectura
      </p>
    </div>
  );
}
