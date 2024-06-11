import { Route, Routes } from 'react-router-dom';
import { BaseNavBar } from '../components/ui/common/BaseNavBar';
import Inicio from "../components/screens/Inicio/Inicio.tsx";
import Producto from '../components/screens/CarritoProducto/Producto.tsx';
import { ListaPedidos } from '../components/screens/Pedidos/ListaPedidos.tsx';
import {Registro} from "../components/screens/Registro/Registro.tsx";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<><BaseNavBar /> <Inicio /></>} />
      <Route path="/inicio/:sucursalId" element={<><BaseNavBar /><Inicio /></>} /> 
      <Route path="/registro" element={<><BaseNavBar /><Registro /></>} />
      <Route path="/carrito/:sucursalId" element={<Producto />} />
      <Route path="/pedidos/:sucursalId" element={<><BaseNavBar /><ListaPedidos /></>}/>
    </Routes>
  );
};
export default AppRouter;