// Iconos de trazo (estilo lineal como en el diseño). Heredan el color del texto.
const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const IconShield = (p) => (
  <svg {...base} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);

export const IconDocumento = (p) => (
  <svg {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </svg>
);

export const IconAlerta = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
);

export const IconFlecha = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const IconAtras = (p) => (
  <svg {...base} {...p}><path d="M15 18l-6-6 6-6" /></svg>
);

export const IconCandado = (p) => (
  <svg {...base} {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);

export const IconRecargar = (p) => (
  <svg {...base} {...p}>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8" />
    <path d="M21 3v5h-5M3 21v-5h5" />
  </svg>
);

export const IconCelular = (p) => (
  <svg {...base} {...p}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M12 18h.01" /></svg>
);

export const IconCheck = (p) => (
  <svg {...base} {...p}><path d="M20 6L9 17l-5-5" /></svg>
);

export const Spinner = () => <span className="spinner" aria-hidden="true" />;

// ---------- Iconos del panel ----------
export const IconCorazon = (p) => (
  <svg {...base} {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" /></svg>
);

export const IconViento = (p) => (
  <svg {...base} {...p}><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7" /></svg>
);

export const IconLuna = (p) => (
  <svg {...base} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
);

export const IconRayo = (p) => (
  <svg {...base} {...p}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);

export const IconPasos = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3c1.7 0 3 1.8 3 4.5S8.8 13 7.5 13 5 11.3 5 8.5 5.3 3 7 3zM5.5 16h4l-.4 2.6a2 2 0 0 1-4 .1z" />
    <path d="M17 6c1.7 0 2 3 2 5.5S17.7 16 16.5 16 14 14.3 14 11.5 15.3 6 17 6zM14.6 19h4l-.4 1.6a2 2 0 0 1-3.5 0z" />
  </svg>
);

export const IconDescarga = (p) => (
  <svg {...base} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
);

export const IconReloj = (p) => (
  <svg {...base} {...p}>
    <rect x="6" y="6" width="12" height="12" rx="3" />
    <path d="M9 6l.6-3h4.8l.6 3M9 18l.6 3h4.8l.6-3" />
  </svg>
);

export const IconTriangulo = (p) => (
  <svg {...base} {...p}>
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

export const IconChispa = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l1.8 4.6L18 9.5l-4.2 1.9L12 16l-1.8-4.6L6 9.5l4.2-1.9z" />
    <path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM5 3l.6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6z" />
  </svg>
);

export const IconInfo = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
);

export const IconX = (p) => (
  <svg {...base} {...p}><path d="M18 6L6 18M6 6l12 12" /></svg>
);

export const IconSube = (p) => (
  <svg {...base} {...p}><path d="M3 17l6-6 4 4 8-8M15 7h6v6" /></svg>
);

export const IconBaja = (p) => (
  <svg {...base} {...p}><path d="M3 7l6 6 4-4 8 8M15 17h6v-6" /></svg>
);

export const IconGrafica = (p) => (
  <svg {...base} {...p}><path d="M3 3v18h18M7 15l4-4 3 3 5-6" /></svg>
);

export const IconCampana = (p) => (
  <svg {...base} {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>
);

/** Icono según la métrica (fc, spo2, sueno, estres, actividad). */
export function IconMetrica({ clave, ...p }) {
  const mapa = { fc: IconCorazon, spo2: IconViento, sueno: IconLuna, estres: IconRayo, actividad: IconPasos };
  const Icono = mapa[clave] ?? IconInfo;
  return <Icono {...p} />;
}

// ---------- Iconos de Información General ----------
export const IconUsuario = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);

export const IconTelefono = (p) => (
  <svg {...base} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const IconGota = (p) => (
  <svg {...base} {...p}><path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0z" /></svg>
);

export const IconEstetoscopio = (p) => (
  <svg {...base} {...p}>
    <path d="M5 3v5a5 5 0 0 0 10 0V3M5 3H3M15 3h2" />
    <path d="M10 13v2a5 5 0 0 0 10 0v-2" />
    <circle cx="20" cy="11" r="2" />
  </svg>
);

export const IconEdificio = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9 21v-4h6v4M12 7v4M10 9h4" />
  </svg>
);

// ---------- Iconos de Historia Clínica ----------
export const IconCalendario = (p) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);

export const IconPdf = (p) => (
  <svg {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 15h6M9 18h4" />
  </svg>
);

export const IconOjo = (p) => (
  <svg {...base} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);

export const IconLugar = (p) => (
  <svg {...base} {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

export const IconVideo = (p) => (
  <svg {...base} {...p}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M22 8l-6 4 6 4z" /></svg>
);

export const IconBuscar = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
);

export const IconAbajo = (p) => (
  <svg {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>
);

// ---------- Iconos de Exámenes ----------
export const IconMatraz = (p) => (
  <svg {...base} {...p}>
    <path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" />
    <path d="M7 15h10" />
  </svg>
);
