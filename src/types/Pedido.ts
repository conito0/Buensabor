import Cliente from "./Cliente";
import DetallePedido from "./DetallePedido";
import Domicilio from "./Domicilio";
import Factura from "./Factura";
import SucursalShorDto from "./dto/SucursalShortDto";
import { Estado } from "./enums/Estado";
// import { FormaPago } from "./enums/FormaPago";
// import { TipoEnvio } from "./enums/TipoEnvio";

export default class Pedido {
  id: number = 0;
  eliminado: boolean = false;
  horaEstimadaFinalizacion: string = '';
  total: number = 0;
  totalCosto: number = 0;
  estado: Estado = Estado.PENDIENTE;
  tipoEnvio: string = '';
  formaPago: string = '';
  fechaPedido: Date = new Date();
  detallePedidos: DetallePedido[] = [];
  sucursal: SucursalShorDto;
  factura?: Factura | null;
  cliente: Cliente; 
  domicilio?: Domicilio | null;
  constructor() {
    this.sucursal = new SucursalShorDto(); // Inicializar la propiedad categoria en el constructor
    this.cliente = new Cliente();
  }
}
