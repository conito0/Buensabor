import DataModel from "./DataModel";

interface Usuario  extends DataModel<Usuario>{
    id: number;
    auth0Id: string;
    username: string;
  }
  
  export default Usuario