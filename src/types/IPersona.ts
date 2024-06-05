import DataModel from "./DataModel";

/**
 * Interfaz que define la estructura de un objeto persona.
 * Contiene propiedades relacionadas con la información personal de una persona.
 */
export default interface IPersona extends DataModel<IPersona>{
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adress: string;
  birthdate: string;
}