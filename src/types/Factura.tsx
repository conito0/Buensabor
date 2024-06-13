import { FormaPago } from "./enums/FormaPago";


export default class Factura {
    fechaFcturacion: Date = new Date;
    mpPaymentId: number = 0;
    mpMerchantOrderId: number = 0;
    mpPreferenceId: string = '';
    mpPaymentType: string = '';
    formaPago: FormaPago | null = null;
    totalVenta: number = 0;
}
