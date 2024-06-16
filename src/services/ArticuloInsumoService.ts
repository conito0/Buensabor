import ArticuloInsumo from "../types/ArticuloInsumoType";
import  BackendClient  from "./BackendClient";

export default class ArticuloInsumoService extends BackendClient<ArticuloInsumo> {
    public async insumos(url: string, idSucursal: number): Promise<ArticuloInsumo[]> {
        try {
          const path = `${url}articuloInsumo/sucursal/${idSucursal}`;
          const response = await fetch(path, { method: "GET" ,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },});      
          if (!response.ok) {
            throw new Error(response.statusText);
          }
      
          const data = await response.json();
          return data as ArticuloInsumo[];
        } catch (error) {
          console.error("Error al obtener los pedidos del cliente:", error);
          throw error;
        }
      }
}