import BackendClient from "./BackendClient.ts";
import {Cliente} from "../types/Cliente.ts";

export default class ClientService extends BackendClient<Cliente> {

    public async getByEmail(path: string, options: RequestInit): Promise<Cliente | undefined> {
        try {
            const response = await fetch(path, options);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        } catch (error) {
            return undefined
        }
    }

}