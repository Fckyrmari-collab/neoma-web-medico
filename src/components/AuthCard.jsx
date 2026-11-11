import { IconAtras } from './Icons.jsx';

/** Emblema circular con el símbolo de NEOMA (luna + red de puntos). */
export function Emblema({ estado = 'normal' }) {
  return (
    <div className={`emblema emblema--${estado}`} aria-hidden="true">
      <img src="./logo/neoma-simbolo.png" alt="" />
    </div>
  );
}

/** Tarjeta blanca con barra superior verde, usada por todas las pantallas de acceso. */
export default function AuthCard({ titulo, subtitulo, onVolver, emblema = 'normal', children }) {
  return (
    <section className="card" aria-labelledby="card-titulo">
      {onVolver && (
        <button type="button" className="card__volver" onClick={onVolver}>
          <IconAtras /> Volver
        </button>
      )}
      <Emblema estado={emblema} />
      <h1 id="card-titulo" className="card__titulo">{titulo}</h1>
      {subtitulo && <p className="card__subtitulo">{subtitulo}</p>}
      {children}
    </section>
  );
}
