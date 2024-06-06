import DataModel from "../DataModel";
import CategoriaShorDto from "./CategoriaShorDto";
import SucursalShorDto from "./SucursalShortDto";


interface CategoriaCreateDto extends DataModel<CategoriaCreateDto>{
    id: number;
    eliminado: false,
    denominacion: string,
    esInsumo: false,
    subCategoria: CategoriaShorDto[],
    sucursales: SucursalShorDto[]
}

export default CategoriaCreateDto;

// private String denominacion;
// private Set<SubCategoriaFullDto> subCategorias;
// private Set<SucursalShortDto> sucursales;
// private boolean esInsumo;