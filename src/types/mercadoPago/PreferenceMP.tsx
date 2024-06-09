export default class PreferenceMP {
    id: string = '';
    idPedido: number = 0;
    statusCode:number = 0;
    fechaCreacion: Date = new Date();
    fechaExpiracion: Date = new Date();
    total: number = 0;
    payerEmail: string = '';
    payerName: string = '';
    payerSurname: string = '';
    paymentMethods: string = '';
}
