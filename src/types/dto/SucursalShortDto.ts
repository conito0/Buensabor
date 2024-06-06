import Domicilio from "../Domicilio";
import EmpresaShorDto from "./EmpresaShortDto";

export default class SucursalShorDto {
  id: number = 0;
  eliminado: boolean = false;
  nombre: string = "";
  horarioApertura: string = "";
  horarioCierre: string = "";
  esCasaMatriz: boolean = false;
  domicilio: Domicilio;
  empresa: EmpresaShorDto;
  constructor() {
    this.domicilio = new Domicilio(); // Inicializar la propiedad categoria en el constructor
    this.empresa = new EmpresaShorDto();
  }
}
