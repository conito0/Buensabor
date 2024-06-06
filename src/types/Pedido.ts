import DetallePedido from "./DetallePedido";
import SucursalShorDto from "./dto/SucursalShortDto";
import { Estado } from "./enums/Estado";
import { FormaPago } from "./enums/FormaPago";
import { TipoEnvio } from "./enums/TipoEnvio";

export default class Pedido {
  id: number = 0;
  eliminado: boolean = false;
  horaEstimadaFinalizacion: string = '';
  total: number = 0;
  totalCosto: number = 0;
  estado: Estado = Estado.PENDIENTE;
  tipoEnvio: TipoEnvio = TipoEnvio.DELIVERY;
  formaPago: FormaPago = FormaPago.MERCADOPAGO;
  fechaPedido: Date = new Date();
  detallePedidos: DetallePedido[] = [];
  sucursal: SucursalShorDto;
  constructor() {
    this.sucursal = new SucursalShorDto(); // Inicializar la propiedad categoria en el constructor
  }
}
