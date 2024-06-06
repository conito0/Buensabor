import DataModel from "./DataModel";
import DetallePedido from "./DetallePedido";
import SucursalShorDto from "./dto/SucursalShortDto";
import { Estado } from "./enums/Estado";
import { FormaPago } from "./enums/FormaPago";
import { TipoEnvio } from "./enums/TipoEnvio";

interface Pedido extends DataModel<Pedido>{
    horaEstimadaFinalizacion: string;
    total: number;
    totalCosto: number;
    estado: Estado;
    tipoEnvio: TipoEnvio;
    formaPago: FormaPago;
    fechaPedido: string;
    detallePedidos: DetallePedido[];
    sucursal: SucursalShorDto
  }

  export default Pedido;
