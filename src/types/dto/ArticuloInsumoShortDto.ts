import DataModel from "../DataModel";
import IUnidadMedida from "../UnidadMedida";
import CategoriaShorDto from "./CategoriaShorDto";


interface ArticuloInsumoShortDto extends DataModel<ArticuloInsumoShortDto>{
    id: number;
    denominacion: string;
    eliminado: boolean;
    precioVenta: number;
    unidadMedida: IUnidadMedida;
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    stockMinimo: number;
    esParaElaborar: boolean;
    categoria: CategoriaShorDto;
}

export default ArticuloInsumoShortDto;