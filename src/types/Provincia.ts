import Pais from "./Pais";

export default class Provincia {
  id: number = 0;
  eliminado: boolean = false;
  nombre: string = "";
  pais: Pais;
  constructor() {
    this.pais = new Pais(); // Inicializar la propiedad categoria en el constructor
  }
}
