import DataModel from "./DataModel";
import ArticuloDto from "./dto/ArticuloDto";


interface DetallePedido extends DataModel<DetallePedido>{
    cantidad: number;
    subTotal: number;
    articulo: ArticuloDto;
    
}

export default DetallePedido;