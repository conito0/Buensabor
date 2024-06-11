import { Route, Routes } from 'react-router-dom';
import Inicio from "../components/screens/Inicio/Inicio.tsx";
import Producto from '../components/screens/CarritoProducto/Producto.tsx';
import { ListaPedidos } from '../components/screens/Pedidos/ListaPedidos.tsx';
import {Registro} from "../components/screens/Registro/Registro.tsx";
// import {AuthenticationGuard} from "../auth0/AuthenticationGuard.tsx";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/inicio/:sucursalId" element={<Inicio />} />
      <Route path="/registro" element={<Registro/>} />
      <Route path="/carrito/:sucursalId" element={<Producto />} />
      <Route path="/pedidos/:sucursalId" element={<ListaPedidos/>}/>
    </Routes>
  );
};
export default AppRouter;