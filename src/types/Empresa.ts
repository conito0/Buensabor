import DataModel from "./DataModel";
import Imagen from "./Imagen";


interface Empresa extends DataModel<Empresa>{
    nombre: string;
    razonSocial: string;
    cuil: number;
    imagen: Imagen;
}

export default Empresa;