import Usuario from "./Usuario";

export default class Cliente {
  id: number = 0;
  nombre: string = "";
  apellido: string = "";
  telefono: string = "";
  email: string = "";
  usuario: Usuario;

  constructor() {
    this.usuario = new Usuario(); // Inicializar la propiedad usuario en el constructor
  }
}
