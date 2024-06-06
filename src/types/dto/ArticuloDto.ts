import Imagen from "../Imagen";
import IUnidadMedida from "../UnidadMedida";
import CategoriaShorDto from "./CategoriaShorDto";

export default class ArticuloDto {
  id: number = 0;
  eliminado: boolean = false;
  denominacion: string = "";
  precioVenta: number = 0;
  imagen: Imagen;
  unidadMedida: IUnidadMedida;
  precioCompra: number = 0;
  stockActual: number = 0;
  stockMaximo: number = 0;
  esParaElaborar: boolean = false;
  categoria: CategoriaShorDto;
  constructor() {
    this.imagen = new Imagen(); // Inicializar la propiedad categoria en el constructor
    this.unidadMedida = new IUnidadMedida();
    this.categoria = new CategoriaShorDto();
  }
}
