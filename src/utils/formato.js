export const SIN_DATO = '—';

/** Número con decimales fijos, o "—" si no hay dato. */
export function numero(valor, decimales = 0) {
  if (valor == null || Number.isNaN(valor)) return SIN_DATO;
  return Number(valor).toFixed(decimales); // punto decimal, como en el diseño: 96.8
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "14 oct" */
export function fechaCorta(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}

/** "14 oct, 02:17 a.m."  (si no trae hora, solo "14 oct") */
export function fechaHora(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (d.getHours() === 0 && d.getMinutes() === 0) return fechaCorta(iso);
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${fechaCorta(iso)}, ${String(h).padStart(2, '0')}:${m} ${d.getHours() < 12 ? 'a.m.' : 'p.m.'}`;
}

/** "09:43" */
export function hora(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Convierte **texto** en <strong> sin usar HTML crudo. */
export function partesNegrilla(texto) {
  return texto.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((p) =>
    p.startsWith('**') ? { negrilla: true, texto: p.slice(2, -2) } : { negrilla: false, texto: p }
  );
}
