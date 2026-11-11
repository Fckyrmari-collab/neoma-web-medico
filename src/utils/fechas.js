/**
 * Ayudas de fecha para la Historia Clínica.
 * Las fechas 'AAAA-MM-DD' se leen como fecha local para que no salgan un día antes.
 */
export const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const MESES_LARGOS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function aFecha(v) {
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [a, m, d] = v.split('-').map(Number);
    return new Date(a, m - 1, d);
  }
  return new Date(v);
}

/** Ordena de la más reciente a la más antigua (por la propiedad `fecha`). */
export const porFechaDesc = (a, b) => aFecha(b.fecha) - aFecha(a.fecha);

/** "12 sep 2026" */
export function fechaTexto(v) {
  if (!v) return '—';
  const d = aFecha(v);
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

/** "8:00 a.m." (null si la fecha no trae hora) */
export function horaTexto(v) {
  const d = aFecha(v);
  if (d.getHours() === 0 && d.getMinutes() === 0) return null;
  const h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() < 12 ? 'a.m.' : 'p.m.'}`;
}

/** "Septiembre 2026" */
export function mesAnio(v) {
  const d = aFecha(v);
  return `${MESES_LARGOS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "hace 5 años", "hace 3 meses" */
export function haceCuanto(v) {
  if (!v) return null;
  const meses = Math.floor((Date.now() - aFecha(v)) / (1000 * 60 * 60 * 24 * 30.44));
  if (meses < 1) return 'este mes';
  if (meses < 12) return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const anios = Math.floor(meses / 12);
  return `hace ${anios} ${anios === 1 ? 'año' : 'años'}`;
}

/** 284 → "284 KB", 2150 → "2.1 MB" */
export const tamanoArchivo = (kb) => (kb == null ? null : kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);
