export interface Cliente {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    usuario: {
        auth0Id: string;
        username: string;
        email: string;
        rol: string;
    }
}