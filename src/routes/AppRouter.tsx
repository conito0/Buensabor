import { Route, Routes } from 'react-router-dom';
import { BaseNavBar } from '../components/ui/common/BaseNavBar';
import Inicio from "../components/screens/Inicio/Inicio.tsx";
import {ListaSucursal} from "../components/screens/Sucursal/Sucursal.tsx";
import {ListaEmpresa} from "../components/screens/Empresa/Empresa.tsx";
import Producto from '../components/screens/CarritoProducto/Producto.tsx';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<><BaseNavBar /> <ListaEmpresa /></>} />
      <Route path="/inicio/:sucursalId" element={<><BaseNavBar /><Inicio /></>} /> 
      <Route path="/sucursal/:empresaId" element={<><BaseNavBar /><ListaSucursal /></>} />
      <Route path="/carrito/:sucursalId" element={<><BaseNavBar /><Producto /></>} /> 
    </Routes>
  );
};
export default AppRouter;