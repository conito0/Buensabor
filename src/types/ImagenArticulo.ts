import DataModel from "./DataModel";

interface ImagenArticulo extends DataModel<ImagenArticulo>{
    name: string;
    url: string;
}
export default ImagenArticulo;