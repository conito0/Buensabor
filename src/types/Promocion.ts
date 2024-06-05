import DataModel from "./DataModel";
import Imagen from "./Imagen";
import PromocionDetalle from "./PromocionDetalle";
import SucursalShorDto from "./dto/SucursalShortDto";

interface Promocion extends DataModel<Promocion>{
  denominacion: string,
  fechaDesde: Date,
  fechaHasta: Date,
  horaDesde: string,
  horaHasta: string,
  descripcionDescuento: string,
  precioPromocional: number,
  tipoPromocion: string,
  imagenes: Imagen[],
  sucursales: SucursalShorDto[],
  promocionDetalle: PromocionDetalle[]
}
export default Promocion;
