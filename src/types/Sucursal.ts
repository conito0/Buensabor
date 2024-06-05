import DataModel from "./DataModel";
import Domicilio from "./Domicilio";
import Empresa from "./Empresa";
import Imagen from "./Imagen";


interface Sucursal extends DataModel<Sucursal>{
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    esCasaMatriz: boolean;
    imagen: Imagen;
    domicilio: Domicilio;
    empresa: Empresa;
}

export default Sucursal;