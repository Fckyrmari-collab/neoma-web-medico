/**
 * Configuración de cada métrica biométrica: nombre, unidad, color, ejes de la gráfica
 * y si subir es bueno o malo (para pintar el porcentaje en rojo o verde).
 */
export const METRICAS = {
  fc: {
    clave: 'fc',
    titulo: 'Frecuencia Cardíaca',
    corto: 'FC',
    unidad: 'lpm',
    color: 'var(--c-fc)',
    decimales: 0,
    subirEsMalo: true,
    eje: { min: 0, max: 100, paso: 25 },
    umbral: 80,
  },
  spo2: {
    clave: 'spo2',
    titulo: 'Saturación SpO₂',
    corto: 'SpO₂',
    unidad: '%',
    color: 'var(--c-spo2)',
    decimales: 1,
    subirEsMalo: false,
    eje: { min: 80, max: 100, paso: 5 },
    umbral: 94,
  },
  sueno: {
    clave: 'sueno',
    titulo: 'Horas de Sueño',
    corto: 'Sueño',
    unidad: 'hrs',
    color: 'var(--c-sueno)',
    decimales: 1,
    subirEsMalo: false,
    eje: { min: 0, max: 10, paso: 2 },
    umbral: 7,
  },
  estres: {
    clave: 'estres',
    titulo: 'Índice de Estrés',
    corto: 'Estrés',
    unidad: '%',
    color: 'var(--c-estres)',
    decimales: 0,
    subirEsMalo: true,
    eje: { min: 0, max: 100, paso: 25 },
    umbral: 60,
  },
};

export const ORDEN_METRICAS = ['fc', 'spo2', 'sueno', 'estres'];

export const COMPONENTES_SCORE = [
  { clave: 'cardiovascular', nombre: 'Cardiovascular', color: 'var(--c-fc)' },
  { clave: 'sueno', nombre: 'Sueño', color: 'var(--c-sueno)' },
  { clave: 'actividad', nombre: 'Actividad', color: 'var(--petroleo)' },
  { clave: 'respiratorio', nombre: 'Respiratorio', color: 'var(--c-ok)' },
];

export const RIESGOS = {
  bajo: { texto: 'Riesgo Bajo', clase: 'ok', color: 'var(--c-ok)' },
  medio: { texto: 'Riesgo Medio', clase: 'medio', color: 'var(--c-estres)' },
  alto: { texto: 'Riesgo Alto', clase: 'alto', color: 'var(--c-fc)' },
};
