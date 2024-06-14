import Categoria from "../types/Categoria";
import ICategoria from "../types/Categoria";
import  BackendClient  from "./BackendClient";

export default class CategoriaService extends BackendClient<ICategoria> {
    public async categoriaSucursal(url: string, idSucursal: number): Promise<Categoria[]> {
        try {
          const path = `${url}categoria/sucursal/${idSucursal}`;
          const response = await fetch(path, { method: "GET" ,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },});
          if (!response.ok) {
            throw new Error(response.statusText);
          }
      
          const data = await response.json();
          return data as Categoria[];
        } catch (error) {
          console.error("Error al obtener los pedidos del cliente:", error);
          throw error;
        }
      }
}