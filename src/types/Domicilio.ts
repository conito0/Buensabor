import Localidad from "./Localidad";

export default class Domicilio {
  id: number = 0;
  eliminado: boolean = false;
  calle: string = '';
  numero: number = 0;
  cp: number = 0;
  piso: number = 0;
  nroDpto: number = 0;
  localidad: Localidad;
  constructor() {
    this.localidad = new Localidad(); // Inicializar la propiedad categoria en el constructor
  }
}
