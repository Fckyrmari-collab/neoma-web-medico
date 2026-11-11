/** Deja solo dígitos (el médico puede escribir "12.345.678" o "CC 12345678"). */
export const soloDigitos = (valor) => valor.replace(/\D/g, '');

/** Cédula colombiana: entre 6 y 10 dígitos. */
export function documentoValido(valor) {
  const d = soloDigitos(valor);
  return d.length >= 6 && d.length <= 10;
}

export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

export function formatoTiempo(seg) {
  const m = Math.floor(seg / 60);
  const s = String(seg % 60).padStart(2, '0');
  return `${m}:${s}`;
}
