import DataModel from "./DataModel";
import Sucursal from "./Sucursal";
import CategoriaShorDto from "./dto/CategoriaShorDto";

interface Categoria extends DataModel<Categoria>{
    denominacion: string,
    esInsumo: false,
    subCategorias: CategoriaShorDto[],
    sucursales: Sucursal[]
}

export default Categoria;