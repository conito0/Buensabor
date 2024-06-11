import Cliente from "../types/Cliente";
import BackendClient from "./BackendClient";

export default class ClientService extends BackendClient<Cliente> {
    public async getByEmail(baseUrl: string, email: string): Promise<Cliente | undefined> {
        try {
            const response = await fetch(`${baseUrl}/email/${email}`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        } catch (error) {
            console.error("Error fetching client by email:", error);
            return undefined;
        }
    }
}