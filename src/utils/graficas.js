/**
 * Utilidades para dibujar líneas suaves en SVG sin librerías externas.
 */

/** Convierte una serie de valores en puntos {x, y} dentro de un rectángulo. */
export function aPuntos(serie, { x0, x1, y0, y1, min, max, total = serie.length }) {
  const pasos = Math.max(total - 1, 1);
  const rango = max - min || 1;
  return serie.map((v, i) =>
    v == null
      ? null
      : {
          x: x0 + ((x1 - x0) * i) / pasos,
          y: y1 - ((Math.min(Math.max(v, min), max) - min) / rango) * (y1 - y0),
          v,
          i,
        }
  );
}

/** Separa en tramos cuando hay días sin datos (null) para no unirlos con una línea. */
export function tramos(puntos) {
  const out = [];
  let actual = [];
  puntos.forEach((p) => {
    if (p) actual.push(p);
    else if (actual.length) {
      out.push(actual);
      actual = [];
    }
  });
  if (actual.length) out.push(actual);
  return out;
}

/** Curva suave (Catmull-Rom → Bézier) que pasa por todos los puntos. */
export function caminoSuave(pts) {
  if (!pts.length) return '';
  if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = 6;
    const c1x = p1.x + (p2.x - p0.x) / t;
    const c1y = p1.y + (p2.y - p0.y) / t;
    const c2x = p2.x - (p3.x - p1.x) / t;
    const c2y = p2.y - (p3.y - p1.y) / t;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/** Área rellena bajo la curva hasta la base. */
export function caminoArea(pts, base) {
  if (pts.length < 2) return '';
  return `${caminoSuave(pts)} L${pts.at(-1).x},${base} L${pts[0].x},${base} Z`;
}
