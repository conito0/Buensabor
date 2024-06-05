// import ArticuloInsumo from "./ArticuloInsumoType";
import DataModel from "./DataModel";
import ArticuloInsumoShortDto from "./dto/ArticuloInsumoShortDto";
// import IUnidadMedida from "./UnidadMedida";
// import CategoriaShorDto from "./dto/CategoriaShorDto";
// import ArticuloInsumoShortDto from "./dto/ArticuloInsumoShortDto";

interface IArticuloManufacturadoDetalle extends  DataModel<IArticuloManufacturadoDetalle> {
    cantidad: number;
    articuloInsumo: ArticuloInsumoShortDto
}

export default IArticuloManufacturadoDetalle;