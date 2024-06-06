import Provincia from "./Provincia";

export default class Localidad {
  id: number = 0;
  eliminado: boolean = false;
  nombre: string = "";
  provincia: Provincia;
  constructor() {
    this.provincia = new Provincia(); // Inicializar la propiedad categoria en el constructor
  }
}
