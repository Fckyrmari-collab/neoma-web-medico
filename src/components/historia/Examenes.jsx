import { useState } from 'react';
import { Esqueleto } from '../panel/Comunes.jsx';
import { fechaTexto, porFechaDesc, tamanoArchivo } from '../../utils/fechas.js';

/* Iconos propios de esta sección (así no hace falta tocar Icons.jsx) */
const base = {
  width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
};
const IconPdf = (p) => (
  <svg {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 15h6M9 18h4" />
  </svg>
);
const IconMatraz = (p) => (
  <svg {...base} {...p}>
    <path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" />
    <path d="M7 15h10" />
  </svg>
);
const IconEstetoscopio = (p) => (
  <svg {...base} {...p}>
    <path d="M5 3v5a5 5 0 0 0 10 0V3M5 3H3M15 3h2" />
    <path d="M10 13v2a5 5 0 0 0 10 0v-2" />
    <circle cx="20" cy="11" r="2" />
  </svg>
);
const IconOjo = (p) => (
  <svg {...base} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IconDescarga = (p) => (
  <svg {...base} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
);
const IconInfo = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
);

const RESULTADOS = {
  normal: { texto: 'Normal', clase: 'ok' },
  alterado: { texto: 'Alterado', clase: 'alterado' },
  pendiente: { texto: 'Pendiente', clase: 'pendiente' },
};

const TIPOS_ORDEN = { orden: 'Orden', receta: 'Receta', indicaciones: 'Indicaciones' };

/**
 * Exámenes del paciente con dos pestañas, igual que en la app:
 *  - Órdenes Médicas (órdenes, recetas, indicaciones)
 *  - Laboratorios (resultados, con estado Normal / Alterado / Pendiente)
 * El médico solo puede ver y descargar; el paciente es quien sube los PDF.
 */
export default function Examenes({ ordenes, laboratorios, cargando }) {
  const [pestana, setPestana] = useState('ordenes');
  const esLab = pestana === 'laboratorios';
  const lista = [...(esLab ? laboratorios : ordenes)].sort(porFechaDesc);
  const ultimo = lista[0];
  const Icono = esLab ? IconMatraz : IconEstetoscopio;

  return (
    <section className="tarjeta hc-examenes" aria-labelledby="hc-exam-titulo">
      <div className="hc-cabecera">
        <span className="hc-cabecera__icono" aria-hidden="true"><IconPdf width={16} height={16} /></span>
        <div>
          <h2 id="hc-exam-titulo">Exámenes y Documentos</h2>
          <span>Archivos subidos por el paciente desde su app</span>
        </div>
      </div>

      <div className="hc-examenes__cuerpo">
        {/* Pestañas como en la app */}
        <div className="hc-toggle" role="tablist" aria-label="Tipo de documento">
          <button
            type="button"
            role="tab"
            aria-selected={!esLab}
            className={!esLab ? 'activo' : ''}
            onClick={() => setPestana('ordenes')}
          >
            <IconEstetoscopio width={15} height={15} /> Órdenes Médicas
            <span className="hc-toggle__n">{ordenes.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={esLab}
            className={esLab ? 'activo' : ''}
            onClick={() => setPestana('laboratorios')}
          >
            <IconMatraz width={15} height={15} /> Laboratorios
            <span className="hc-toggle__n">{laboratorios.length}</span>
          </button>
        </div>

        {/* Banner verde con el conteo */}
        <div className="hc-banner">
          <Icono width={18} height={18} />
          <div>
            <strong>{lista.length} {lista.length === 1 ? 'documento' : 'documentos'}</strong>
            <span>{ultimo ? `Último: ${fechaTexto(ultimo.fecha)}` : 'Aún no hay archivos'}</span>
          </div>
        </div>

        {cargando ? (
          <div className="hc-lista-carga">
            {[0, 1, 2].map((i) => <Esqueleto key={i} ancho="100%" alto={52} />)}
          </div>
        ) : !lista.length ? (
          <div className="hc-vacio-docs">
            <span aria-hidden="true"><Icono width={20} height={20} /></span>
            <strong>{esLab ? 'Sin resultados de laboratorio' : 'Sin órdenes médicas'}</strong>
            <p>
              {esLab
                ? 'Cuando el paciente suba sus resultados en PDF aparecerán aquí con su estado.'
                : 'Cuando el paciente suba órdenes o recetas en PDF aparecerán aquí.'}
            </p>
          </div>
        ) : (
          <ul className="hc-docs">
            {lista.map((doc) => {
              const res = RESULTADOS[doc.resultado];
              const sub = esLab
                ? [doc.laboratorio, fechaTexto(doc.fecha), tamanoArchivo(doc.tamanoKB)]
                : [TIPOS_ORDEN[doc.tipo], doc.medico, fechaTexto(doc.fecha), tamanoArchivo(doc.tamanoKB)];
              return (
                <li key={doc.id}>
                  <span className="hc-docs__icono" aria-hidden="true"><IconPdf width={17} height={17} /></span>
                  <div className="hc-docs__texto">
                    <strong>{doc.titulo}</strong>
                    <span>{sub.filter(Boolean).join(' · ')}</span>
                  </div>
                  {esLab && res && <span className={`hc-estado hc-estado--${res.clase}`}>{res.texto}</span>}
                  <div className="hc-docs__acciones">
                    <a
                      href={doc.url || undefined}
                      target="_blank"
                      rel="noreferrer"
                      title="Ver PDF"
                      aria-label={`Ver ${doc.titulo}`}
                      className={!doc.url ? 'deshabilitado' : ''}
                    >
                      <IconOjo width={16} height={16} />
                    </a>
                    <a
                      href={doc.url || undefined}
                      download
                      title="Descargar"
                      aria-label={`Descargar ${doc.titulo}`}
                      className={!doc.url ? 'deshabilitado' : ''}
                    >
                      <IconDescarga width={16} height={16} />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="hc-aviso">
          <IconInfo width={13} height={13} />
          Solo se aceptan PDFs oficiales emitidos por un profesional médico o laboratorio certificado.
        </p>
      </div>
    </section>
  );
}
