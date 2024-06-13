// Importación de la clase abstracta AbstractBackendClient
import Pedido from "../types/Pedido";
import PreferenceMP from "../types/mercadoPago/PreferenceMP";
import { AbstractBackendClient } from "./AbstractBackendClient";

// Clase abstracta que proporciona métodos genéricos para interactuar con una API
export default abstract class BackendClient<T> extends AbstractBackendClient<T> {
  // Método protegido para realizar una solicitud genérica
  protected async request<T>(path: string, options: RequestInit): Promise<T> {
    try {
      // Realiza una solicitud fetch con la ruta y las opciones proporcionadas
      const response = await fetch(path, options);

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        console.log(response.statusText);
        // Si no es exitosa, lanza un error con el mensaje de estado de la respuesta
        throw new Error(response.statusText);
      }

      // Intenta obtener el cuerpo de la respuesta como texto
      const text = await response.text();
      // Si el texto está vacío, retorna un objeto vacío
      if (!text) return {} as T;

      // Intenta convertir el texto en JSON y retornarlo
      return JSON.parse(text);
    } catch (error) {
      // Si hay algún error, rechaza la promesa con el error
      return Promise.reject(error);
    }
  }

  // Método protegido para realizar una solicitud genérica para obtener todos los elementos
  protected async requestAll(path: string, options: RequestInit): Promise<T[]> {
    try {
      const response = await fetch(path, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Implementación de los métodos de la interfaz AbstractCrudService

  // Método para obtener un elemento por su ID
  async get(url: string, id: string): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "GET",
    };
    return this.request(path, options);
  }

  // Método para obtener todos los elementos
  async getAll(url: string): Promise<T[]> {
    const path = url;
    const options: RequestInit = {
      method: "GET",
    };
    return this.requestAll(path, options);
  }

  // Método para crear un nuevo elemento
  async post(url: string, data: T): Promise<T> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return this.request(path, options);
  }

  // Método para actualizar un elemento existente por su ID
  async put(url: string, id: string, data: T): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  // Método para eliminar un elemento por su ID
  async delete(url:string, id: string): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    
    try {
      await this.request(path, options);
      console.log('Eliminación lógica realizada correctamente.');
    } catch (error) {
      console.error('Error al eliminar:', error);
      throw error;
    }
  }

  // Método para subir archivos
  async uploadFile(url: string, file: File, id: string): Promise<Response> {
    const path = url;
    const formData = new FormData();
    formData.append('uploads', file);
    formData.append('id', id);

    const options: RequestInit = {
      method: "POST",
      body: formData,
    };

    return fetch(path, options);
  }
  // Método para descontar el stock
  async descontarStock(url: string, id: number, cantidad: number): Promise<number> {
    const path = `${url}/${id}/${cantidad}`;
    const options: RequestInit = {
      method: "GET", // Usar GET ya que el backend lo espera
    };
  
    try {
      const response = await this.request(path, options);
  
      if (typeof response !== 'number' || isNaN(response)) {
        throw new Error("La respuesta no es un número válido");
      }
  
      return response;
    } catch (error) {
      throw new Error("Error al procesar la respuesta: " + error);
    }
  }
  // mercado pago
  async createPreferenceMP(pedido: Pedido): Promise<PreferenceMP> {
    const urlServer = "http://localhost:8080/mercado_pago/create_preference";
    try {
      const response = await fetch(urlServer, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(pedido),
      });
      if (!response.ok) {
        throw new Error(
          `Error al crear preferencia de Mercado Pago: ${response.statusText}`
        );
      }
      const responseData = await response.json();
      console.log("Respuesta de la API:", responseData);
      return responseData as PreferenceMP;
    } catch (error) {
      console.error("Error en createPreferenceMP:", error);
      throw error;
    }
  }
}