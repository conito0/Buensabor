import DataModel from "./DataModel";
import Pais from "./Pais";

interface Provincia extends DataModel<Provincia>{
  nombre: string;
  pais: Pais;
  }

  export default Provincia;
