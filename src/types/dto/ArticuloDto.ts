import DataModel from "../DataModel";
import Imagen from "../Imagen";
import IUnidadMedida from "../UnidadMedida";
import CategoriaShorDto from "./CategoriaShorDto";


interface ArticuloDto extends DataModel<ArticuloDto>{
    denominacion: string;
    precioVenta: number;
    imagen: Imagen;
    unidadMedida: IUnidadMedida;
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    esParaElaborar: boolean;
    categoria: CategoriaShorDto;
}

export default ArticuloDto;

