import DataModel from "./DataModel";


interface Cupones extends DataModel<Cupones>{
    denominacion: string;
    fechaDesde: Date;
    fechaHasta: Date;
    descripcion: string;
}

export default Cupones;