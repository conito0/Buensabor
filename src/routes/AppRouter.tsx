import { Route, Routes } from 'react-router-dom';
import Inicio from "../components/screens/Inicio/Inicio.tsx";
import {ListaSucursal} from "../components/screens/Sucursal/Sucursal.tsx";
import {ListaEmpresa} from "../components/screens/Empresa/Empresa.tsx";
import Producto from '../components/screens/CarritoProducto/Producto.tsx';
import { ListaArticulosInsumo } from '../components/screens/ArticuloInsumo/ArticuloInsumo.tsx';
import { ListaProductos } from '../components/screens/Productos/ListaProductos.tsx';
import Categoria from '../components/screens/Categoria/Categoria.tsx';
import { ListaPedidos } from '../components/screens/Pedidos/ListaPedidos.tsx';
import {Registro} from "../components/screens/Registro/Registro.tsx";
import {AuthenticationGuard} from "../auth0/AuthenticationGuard.tsx";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthenticationGuard component={ListaEmpresa} />} />
      <Route path="/inicio/:sucursalId" element={<AuthenticationGuard component={Inicio} />} />
      <Route path="/sucursal/:empresaId" element={<AuthenticationGuard component={ListaSucursal} />} />
      <Route path="/registro" element={<AuthenticationGuard component={Registro} />} />
      <Route path="/carrito/:sucursalId" element={<AuthenticationGuard component={Producto} />} />
      <Route path="/productos/:sucursalId" element={<AuthenticationGuard component={Producto} />} />
      <Route path="/categorias/:sucursalId" element={<AuthenticationGuard component={Categoria} />} />
      <Route path="/articuloInsumo/:sucursalId" element={<AuthenticationGuard component={ListaArticulosInsumo} />} />
      <Route path="/articuloManufacturado/:sucursalId" element={<AuthenticationGuard component={ListaProductos} />} />
      <Route path="/pedidos/:sucursalId" element={<AuthenticationGuard component={ListaPedidos} />}/>

    </Routes>
  );
};
export default AppRouter;