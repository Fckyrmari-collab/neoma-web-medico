export default function Header() {
  return (
    <header className="header">
      <a className="header__marca" href="./" aria-label="NEOMA, inicio">
        <img src="./logo/neoma-simbolo.png" alt="" className="header__simbolo" />
        <span className="header__nombre">NEOMA</span>
      </a>
      <span className="header__tag">Plataforma Clínica · Acceso Seguro</span>
    </header>
  );
}
