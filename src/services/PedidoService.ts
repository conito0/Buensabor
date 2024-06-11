import Pedido from "../types/Pedido";
import BackendClient from "./BackendClient";

export default class PedidoService extends BackendClient<Pedido> {
    public async pedidosCliente(url: string, idCliente: number): Promise<Pedido[]> {
        try {
          const path = `${url}pedido/cliente/${idCliente}`;
          const response = await fetch(path, { method: "GET" });
      
          if (!response.ok) {
            throw new Error(response.statusText);
          }
      
          const data = await response.json();
          return data as Pedido[];
        } catch (error) {
          console.error("Error al obtener los pedidos del cliente:", error);
          throw error;
        }
      }
}