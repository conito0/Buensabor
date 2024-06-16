
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";

export const BaseNavBar = () => {

  const { user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/registro')
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: `http://localhost:5174/`
      }
    })
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container-fluid ms-3">
        <a className="navbar-brand text-white" href="/inicio/1">
          Buen Sabor
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
                href="/carrito/1"
                >
                Productos
              </a>
            </li>
            {user && isAuthenticated && <li className="nav-item">
              <a
                className="nav-link active text-white"
                aria-current="page"
                href="/pedidos/1"
              >
                Mis Pedidos
              </a>
            </li>}
          </ul>
        </div>
        <form className="d-flex align-items-center text-white" role="search">
          { isAuthenticated ? <div className={"px-2"}><img alt={"Imagen de perfil"} className={"rounded-4"} height={20} width={20} src={user?.picture}/><span> {user?.name}</span></div> : <></> }
          <button hidden={isAuthenticated} onClick={handleLogin} type="button" className={"btn btn-light"}>Registrarse</button>
          <button hidden={!isAuthenticated}  onClick={handleLogout} type="button" className={"btn btn-light"}>Logout</button>
        </form>
      </div>
    </nav>
  );
}