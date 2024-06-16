import IArticuloManufacturado from "../types/ArticuloManufacturado";
import  BackendClient  from "./BackendClient";

export default class ArticuloManufacturadoService extends BackendClient<IArticuloManufacturado> {
    public async manufacturados(url: string, idSucursal: number): Promise<IArticuloManufacturado[]> {
        try {
          const path = `${url}articuloManufacturado/sucursal/${idSucursal}`;
          const response = await fetch(path, { method: "GET" ,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },});      
          if (!response.ok) {
            throw new Error(response.statusText);
          }
      
          const data = await response.json();
          return data as IArticuloManufacturado[];
        } catch (error) {
          console.error("Error al obtener los pedidos del cliente:", error);
          throw error;
        }
    }
}