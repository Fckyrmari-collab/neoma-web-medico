import { useEffect, useRef, useState } from 'react';

/** Mide el ancho de un elemento y se actualiza al cambiar el tamaño de la ventana. */
export default function useAncho(inicial = 600) {
  const ref = useRef(null);
  const [ancho, setAncho] = useState(inicial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver(([entrada]) => setAncho(Math.round(entrada.contentRect.width)));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, ancho];
}
