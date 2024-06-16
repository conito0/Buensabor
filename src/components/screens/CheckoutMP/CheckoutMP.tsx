import React, { useState, useEffect } from "react";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import PedidoService from "../../../services/PedidoService";
import PreferenceMPService from "../../../services/mercadoPago/PreferenceMPService";
import { useAuth0 } from "@auth0/auth0-react";

function CheckoutMP({ idPedido = 0, iniciarProcesoAutomaticamente = false }) {
  const [idPreference, setIdPreference] = useState('');
  const [mostrarPagoMP, setMostrarPagoMP] = useState(false); 
  const pedidoService = new PedidoService();
  const preferenceMPService = new PreferenceMPService();
  const url = import.meta.env.VITE_API_URL;
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (iniciarProcesoAutomaticamente) {
      getPreferenceMP();
    }
  }, [iniciarProcesoAutomaticamente]);

  const getPreferenceMP = async () => {
    console.log(idPedido);
    if (idPedido !== 0 && idPedido !== null && idPedido !== undefined) {
      try {
        const pedido = await pedidoService.get(url + "pedido", idPedido.toString());
        const response = await preferenceMPService.createPreferenceMP(pedido);
        if (response && response.id) {
          console.log("Preference id: " + response.id);
          setIdPreference(response.id);
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

  if (!isAuthenticated || !user) {
    return <div>Debe iniciar sesión para continuar.</div>;
  }

  return (
    <div>
      {!iniciarProcesoAutomaticamente && (
        <button onClick={getPreferenceMP} className="btn btn-primary">
          COMPRAR con Mercado Pago
        </button>
      )}

      {mostrarPagoMP && idPreference && (
        <div className="divVisible">
          <Wallet
            initialization={{ preferenceId: idPreference }}
            customization={{ texts: { valueProp: 'smart_option' } }}
          />
        </div>
      )}
    </div>
  );
}

export default CheckoutMP;
