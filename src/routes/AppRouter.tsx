import { Route, Routes } from 'react-router-dom';
import { BaseNavBar } from '../components/ui/common/BaseNavBar';
import Inicio from "../components/screens/Inicio/Inicio.tsx";
import {ListaSucursal} from "../components/screens/Sucursal/Sucursal.tsx";
import {ListaEmpresa} from "../components/screens/Empresa/Empresa.tsx";
import Producto from '../components/screens/CarritoProducto/Producto.tsx';
import { ListaArticulosInsumo } from '../components/screens/ArticuloInsumo/ArticuloInsumo.tsx';
import { ListaProductos } from '../components/screens/Productos/ListaProductos.tsx';
import Categoria from '../components/screens/Categoria/Categoria.tsx';
import { ListaPedidos } from '../components/screens/Pedidos/ListaPedidos.tsx';
import {Registro} from "../components/screens/Registro/Registro.tsx";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<><BaseNavBar /> <ListaEmpresa /></>} />
      <Route path="/inicio/:sucursalId" element={<><BaseNavBar /><Inicio /></>} /> 
      <Route path="/sucursal/:empresaId" element={<><BaseNavBar /><ListaSucursal /></>} />
      <Route path="/registro" element={<><BaseNavBar /><Registro /></>} />
      <Route path="/carrito/:sucursalId" element={<Producto />} />
      <Route path="/productos/:sucursalId" element={<><Producto /></>} /> 
      <Route path="/categorias/:sucursalId" element={<><BaseNavBar /><Categoria /></>} /> 
      <Route path="/articuloInsumo/:sucursalId" element={<><BaseNavBar /><ListaArticulosInsumo /></>} /> 
      <Route path="/articuloManufacturado/:sucursalId" element={<><BaseNavBar /><ListaProductos /></>} />
      <Route path="/pedidos/:sucursalId" element={<><BaseNavBar /><ListaPedidos /></>}/>

    </Routes>
  );
};
export default AppRouter;