import { IconBaja, IconMetrica, IconSube } from '../Icons.jsx';

/** Barra gris animada que se muestra mientras cargan los datos. */
export function Esqueleto({ ancho = '60%', alto = 14 }) {
  return <span className="esqueleto" style={{ width: ancho, height: alto }} aria-hidden="true" />;
}

/** Círculo de color suave con el icono de la métrica. */
export function BurbujaIcono({ clave, color, tamano = 34 }) {
  return (
    <span className="burbuja" style={{ '--color': color, width: tamano, height: tamano }} aria-hidden="true">
      <IconMetrica clave={clave} width={tamano * 0.45} height={tamano * 0.45} />
    </span>
  );
}

/** Píldora con el % de cambio. Rojo si el cambio es malo para el paciente, verde si es bueno. */
export function Variacion({ valor, subirEsMalo }) {
  if (valor == null) return null;
  const sube = valor > 0;
  const malo = subirEsMalo ? sube : !sube;
  const Icono = sube ? IconSube : IconBaja;
  return (
    <span className={`variacion ${malo ? 'variacion--malo' : 'variacion--bueno'}`}>
      <Icono width={11} height={11} />
      {sube ? '+' : ''}
      {Number(valor.toFixed(1))}%
    </span>
  );
}

/** Mensaje centrado para cuando un recuadro aún no tiene datos. */
export function EstadoVacio({ icono, titulo, texto, compacto = false }) {
  return (
    <div className={`vacio ${compacto ? 'vacio--compacto' : ''}`}>
      {icono && <span className="vacio__icono" aria-hidden="true">{icono}</span>}
      <strong>{titulo}</strong>
      {texto && <p>{texto}</p>}
    </div>
  );
}
