import DataModel from "./DataModel";

interface Imagen extends DataModel<Imagen>{
    name: string;
    url: string;
}
export default Imagen;