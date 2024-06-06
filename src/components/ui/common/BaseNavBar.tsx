

export const BaseNavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
    <div className="container-fluid ms-3">
      <a className="navbar-brand text-white" href="/">
        Inicio
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a
              className="nav-link active text-white"
              aria-current="page"
              href="/home"
            >
              Home
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link active text-white"
              aria-current="page"
              href="/carrito"
            >
              Productos
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );
}
