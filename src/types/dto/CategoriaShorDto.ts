import DataModel from "../DataModel";


interface CategoriaShorDto extends DataModel<CategoriaShorDto>{
    id: number;
    eliminado: false,
    denominacion: string,
    esInsumo: false,
}

export default CategoriaShorDto;