// import Pedido from "./Pedido";
import ArticuloDto from "./dto/ArticuloDto";

export default class DetallePedido {
  id: number = 0;
  eliminado: boolean = false;
  cantidad: number = 0;
  subTotal: number = 0;
  articulo: ArticuloDto;
  // pedido: Pedido;
  constructor() {
    this.articulo = new ArticuloDto(); // Inicializar la propiedad categoria en el constructor
    // this.pedido = new Pedido();
  }
}
