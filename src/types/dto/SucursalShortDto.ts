import DataModel from "../DataModel";
import Domicilio from "../Domicilio";
import EmpresaShorDto from "./EmpresaShortDto";


interface SucursalShorDto extends DataModel<SucursalShorDto>{
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    esCasaMatriz: boolean;
    domicilio: Domicilio;
    empresa: EmpresaShorDto;
}

export default SucursalShorDto;