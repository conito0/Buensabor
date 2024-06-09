import { useState } from "react";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import PedidoService from "../../../services/PedidoService";
import PreferenceMPService from "../../../services/mercadoPago/PreferenceMPService";

function CheckoutMP({ idPedido = 0 }) {
  const [idPreference, setIdPreference] = useState<string>('');
  const [fechaCreacion, setFechaCreacion] = useState<Date>(new Date());
  const [fechaExpiracion, setFechaExpiracion] = useState<Date>(new Date());
  const [total, setTotal] = useState<number>(0);
  const [payerEmail, setPayerEmail] = useState<string>('');
  const [payerName, setPayerName] = useState<string>('');
  const [payerSurname, setPayerSurname] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<string>('');
  const preferenceMPService = new PreferenceMPService();
  const [mostrarPagoMP, setMostrarPagoMP] = useState(false); 
  const pedidoService = new PedidoService();
  const url = import.meta.env.VITE_API_URL;

  const getPreferenceMP = async () => {
    console.log(idPedido)
    if (idPedido != 0 || idPedido != null || idPedido != undefined) {

      try {
        const pedido = await pedidoService.get(url + "pedido", idPedido.toString());
        const response = await preferenceMPService.createPreferenceMP(pedido);
        if (response && response.id) {
          console.log("Preference id: " + response.id);
          setIdPreference(response.id);
          setFechaCreacion(response.fechaCreacion);
          setFechaExpiracion(response.fechaExpiracion);
          setPayerEmail(response.payerEmail);
          setPayerName(response.payerName);
          setPayerSurname(response.payerSurname);
          setPaymentMethods(response.paymentMethods);
          setMostrarPagoMP(true); 
        } else {
          console.error('Error: La respuesta de la API no contiene un ID de preferencia.');
        }
      } catch (error) {
        console.error('Error al crear preferencia de Mercado Pago:', error);
      }
    } else {
      alert("Agregue al menos un plato al carrito");
    }
  };

  initMercadoPago('TEST-6b2e320e-c0d2-4ca4-bcbc-eb81e3ddce56', { locale: 'es-AR' });

  return (
    <div>
      <button onClick={getPreferenceMP} className="btn btn-primary">COMPRAR con Mercado Pago</button>
      {mostrarPagoMP && ( 
              <div className={idPreference ? 'divVisible' : 'divInvisible'}>
              <Wallet initialization={{ preferenceId: idPreference, redirectMode: "blank" }} customization={{ texts: { valueProp: 'smart_option' } }} />
            </div>
      )}
    </div>
  );
}

export default CheckoutMP;