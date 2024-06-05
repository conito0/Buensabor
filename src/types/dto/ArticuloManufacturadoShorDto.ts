import DataModel from "../DataModel";
import IUnidadMedida from "../UnidadMedida";
import CategoriaShorDto from "./CategoriaShorDto";


interface ArticuloManufacturadoShorDto extends  DataModel<ArticuloManufacturadoShorDto> {
    denominacion: string;
    precioVenta: number;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    unidadMedida: IUnidadMedida;
    categoria: CategoriaShorDto;
}

export default ArticuloManufacturadoShorDto;