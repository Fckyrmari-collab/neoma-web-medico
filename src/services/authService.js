/**
 * Servicio de autorización médico ↔ paciente.
 *
 * POR AHORA ES UN MOCK (solo frontend). Cuando exista el backend,
 * reemplaza el cuerpo de cada función por la llamada real, por ejemplo:
 *
 *   const res = await fetch(`${API_URL}/acceso/solicitar`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ documento }),
 *   });
 *
 * El componente no tiene que cambiar: solo espera las mismas respuestas.
 */

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

// Código que "llega" a la app del paciente en el mock. En producción
// lo genera el backend y NUNCA viaja al navegador del médico.
const CODIGO_MOCK = '1234';

export const DURACION_CODIGO_SEG = 5 * 60; // 5 minutos
export const MAX_INTENTOS = 5;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Paso 1: pide al backend que envíe la notificación push al paciente. */
export async function solicitarCodigo(documento) {
  await esperar(900);
  return {
    paciente: {
      nombre: 'Juan Pérez Rodríguez',
      documento,
      tipoDocumento: 'CC',
      dispositivo: 'iPhone',
    },
    solicitud: {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      expiraEn: Date.now() + DURACION_CODIGO_SEG * 1000,
    },
  };
}

/** Reenvía el código: genera una solicitud nueva con su propio vencimiento. */
export async function reenviarCodigo(documento) {
  const { solicitud } = await solicitarCodigo(documento);
  return solicitud;
}

/** Paso 2: valida el código que el paciente le dicta al médico. */
export async function validarCodigo(_solicitudId, codigo) {
  await esperar(700);
  if (codigo !== CODIGO_MOCK) return { ok: false };
  return { ok: true, token: 'jwt-de-sesion-medica' };
}
