import { useEffect, useState } from "react";
import { useCarrito } from "../../../hooks/useHooks";
import DetallePedido from "../../../types/DetallePedido";
import "./Carrito.css";
import { useAuth0 } from "@auth0/auth0-react";
import CheckoutMP from "../../screens/CheckoutMP/CheckoutMP";
import { TipoEnvio } from "../../../types/enums/TipoEnvio";
import LocalidaService from "../../../services/LocalidadService";
import ProvinciaService from "../../../services/ProvinciaService";
import PaisService from "../../../services/PaisService";
import Pais from "../../../types/Pais";
import Domicilio from "../../../types/Domicilio";
import Provincia from "../../../types/Provincia";
import Localidad from "../../../types/Localidad";
import { FormaPago } from "../../../types/enums/FormaPago";
// import DomicilioService from "../../../services/DomicilioService";

interface CartItemProps {
  detalle: DetallePedido;
}

function CartItem({ detalle }: CartItemProps) {
  const articulo = detalle?.articulo;
  const imagenUrl = articulo?.imagen?.url;
  
  return (
    <div
      className="w-100 cart-item d-flex flex-row align-items-center"
      key={detalle.id}
    >
      {imagenUrl && (
        <img
          width={50}
          height={50}
          src={imagenUrl}
          alt={detalle.articulo.denominacion}
        />
      )}
      <div className={"w-100 text-left"}>
        <div>
          <b className={"text-truncate"}>{detalle.articulo.denominacion}</b>
        </div>
        <div>${detalle.articulo.precioVenta}</div>
        <div>
          <b>
            {detalle.cantidad} {detalle.cantidad === 1 ? "unidad" : "unidades"}{" "}
          </b>
        </div>
        <hr />
      </div>
    </div>
  );
}

export const Carrito = () => {
  const { cart, limpiarCarrito, crearPedidoDetalle } = useCarrito();
  const [idPedido, setIdPedido] = useState<number | undefined>();
  const [pedidoCreado, setPedidoCreado] = useState(false);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio | null>(null); // Estado para almacenar el tipo de envío elegido
  const [formaPago, setFormaPago] = useState<FormaPago | null>(null); // Estado para almacenar el tipo de envío elegido
  const [domicilio, setDomicilio] = useState<Domicilio>(new Domicilio);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedLocalidad, setLocalidad] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
  const [domicilioCreado, setDomicilioCreado] = useState(false);
  const localidadService = new LocalidaService();
  const provinciaService = new ProvinciaService();
  const paisService = new PaisService();
  const [totalTiempoEspera, setTotalTiempoEspera] = useState<string>('');
  const [idPedidoUrl, setIdPedidoUrl] = useState<string | undefined>();
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mostrarIdPedido, setMostrarIdPedido] = useState(false);

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Obtén los parámetros de la URL actual
    const params = new URLSearchParams(window.location.search);
    const idPedido = params.get('i');
    if (idPedido) {
      setIdPedidoUrl(idPedido)
    }
  }, []);

  useEffect(() => {
    fetchPaises();
  }, []);

  useEffect(() => {
    if (selectedPais) {
      fetchProvincias(selectedPais);
    }
  }, [selectedPais]);

  useEffect(() => {
    if (selectedProvincia) {
      fetchLocalidades(selectedProvincia);
    }
  }, [selectedProvincia]);

  const fetchPaises = async () => {
    try {
      const paisesData = await paisService.getAll(url + "pais");
      setPaises(paisesData);
    } catch (error) {
      console.error("Error fetching countries: ", error);
    }
  };

  const fetchProvincias = async (paisId: number) => {
    try {
      const todasProvincias = await provinciaService.getAll(url + "provincia");
      const provinciasFiltradas = todasProvincias.filter(
        (provincia) => provincia.pais.id === paisId
      );
      setProvincias(provinciasFiltradas);
    } catch (error) {
      console.error("Error fetching provinces: ", error);
    }
  };

  const fetchLocalidades = async (provinciaId: number) => {
    try {
      const todasLocalidades = await localidadService.getAll(url + "localidad");
      const localidadesFiltradas = todasLocalidades.filter(
        (localidad) => localidad.provincia.id === provinciaId
      );
      setLocalidades(localidadesFiltradas);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDomicilio((prevDomicilio: any) => ({
      ...prevDomicilio,
      [name]: value,
    }));
  };
  
  const handleLocalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const localidadId = parseInt(e.target.value, 10);
    const selectedLocalidad = localidades.find(
      (localidad) => localidad.id === localidadId
    );
    if (selectedLocalidad) {
      setDomicilio((prevDomicilio: any) => ({
        ...prevDomicilio,
        localidad: selectedLocalidad,
      }));
      setLocalidad(localidadId)
    }
  };
  
  
  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinciaId = parseInt(e.target.value, 10);
    const selectedProvincia = provincias.find(
      (provincia) => provincia.id === provinciaId
    );
    if (selectedProvincia) {
      setDomicilio((prevDomicilio: any) => ({
        ...prevDomicilio,
        localidad: {
          ...prevDomicilio.localidad,
          provincia: selectedProvincia,
        },
      }));
      setSelectedProvincia(provinciaId);
    } else {
      setDomicilio((prevDomicilio: any) => ({
        ...prevDomicilio,
        localidad: null,
      }));
    }
  };
  
  
  const handlePaisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const paisId = parseInt(e.target.value, 10);
    const selectedPais = paises.find((pais) => pais.id === paisId);
    if (selectedPais) {
      setDomicilio((prevDomicilio: any) => ({
        ...prevDomicilio,
        localidad: prevDomicilio.localidad ? { // Verificación de null
          ...prevDomicilio.localidad,
          provincia: {
            ...prevDomicilio.localidad.provincia,
            pais: selectedPais,
          },
        } : null, // En caso de que prevDomicilio.localidad sea null
      }));
      setSelectedPais(paisId);
    }
  };
  

  const handleLogin = () => {
    loginWithRedirect();
  };

  // const totalProductos = cart.reduce(
  //   (total, detalle) => total + detalle.articulo.precioVenta * detalle.cantidad,
  //   0
  // );

  const subtotal = cart.reduce(
    (total, detalle) => total + detalle.articulo.precioVenta * detalle.cantidad,
    0
  );

  const totalProductos = tipoEnvio === TipoEnvio.TAKEAWAY ? subtotal * 0.9 : subtotal;

  const handleGenerarPedido = async (forma: FormaPago) => {
    const detallesConTiempo = cart.filter(
      (detalle) => detalle.articulo.tiempoEstimadoMinutos !== 0
    );

    // Calcula la suma de los tiempos estimados de los detalles filtrados
    const sumaTiempos = detallesConTiempo.reduce(
      (total, detalle) =>
        total + detalle.articulo.tiempoEstimadoMinutos * detalle.cantidad,
      0
    );

    // Obtén la fecha y hora actual
    const fechaActual = new Date();

    // Calcula la hora estimada de finalización
    const horaActual = fechaActual.getHours();
    const minutosActuales = fechaActual.getMinutes();
    const totalMinutos = minutosActuales + sumaTiempos;

    // Calcula las horas y minutos totales
    const horasAdicionales = Math.floor(totalMinutos / 60);
    // const minutosEstimados = totalMinutos % 60;
    // const horaEstimada = (horaActual + horasAdicionales) % 24;
    let minutosEstimados = totalMinutos % 60;
    let horaEstimada = (horaActual + horasAdicionales) % 24;
    
    // Agregar 10 minutos si el tipo de envío es DELIVERY
    if (tipoEnvio === TipoEnvio.DELIVERY) {
      minutosEstimados += 10;
      if (minutosEstimados >= 60) {
        minutosEstimados -= 60;
        horaEstimada = (horaEstimada + 1) % 24;
      }
    }
    // Formatea la hora y los minutos
    const horaEstimadaFormateada = String(horaEstimada).padStart(2, "0");
    const minutosEstimadosFormateados = String(minutosEstimados).padStart(
      2,
      "0"
    );

    // Resultado final
    const tiempoEstimado = `${horaEstimadaFormateada}:${minutosEstimadosFormateados}`;
    setTotalTiempoEspera(tiempoEstimado);
    try {
      if(tipoEnvio && forma){
        if(tipoEnvio == TipoEnvio.DELIVERY && forma){
            const nuevoIdPedido = await crearPedidoDetalle(tipoEnvio, forma, domicilio);
            setIdPedido(nuevoIdPedido);
            setPedidoCreado(true) 
            setFormaPago(forma) 
        }
        if(tipoEnvio == TipoEnvio.TAKEAWAY && forma){
            const nuevoIdPedido = await crearPedidoDetalle(tipoEnvio, forma);
            setIdPedido(nuevoIdPedido);
            setPedidoCreado(true)
            setFormaPago(forma)
        }
      }
      setTimeout(() => {}, 10000)
    } catch (error) {
      console.error('Error al generar el pedido:', error);
    }
  };
  const limpiarCarritoYResetearIdPedido = () => {
    limpiarCarrito();
    setIdPedidoUrl(undefined);
    setIdPedido(undefined); // Restablecer idPedido a undefined cuando se limpie el carrito
    setPedidoCreado(false);
    setTipoEnvio(null)
    setFormaPago(null)
  };

  useEffect(() => {
    if (idPedidoUrl !== undefined) {
      setMostrarMensaje(true);
      setTimeout(() => {
        setMostrarMensaje(false);
        limpiarCarritoYResetearIdPedido();
      }, 4000); // 4000 milisegundos = 4 segundos
    }
  }, [idPedidoUrl]);

  useEffect(() => {
    if (pedidoCreado && idPedido !== undefined && formaPago === FormaPago.EFECTIVO) {
      setMostrarIdPedido(true);
      setTimeout(() => {
        setMostrarIdPedido(false);
        limpiarCarritoYResetearIdPedido();
      }, 4000); // 5000 milisegundos = 5 segundos
    }
  }, [pedidoCreado, idPedido, formaPago]);
  
  useEffect(() => {
    if (cart.length === 0 && idPedido !== undefined) {
      limpiarCarritoYResetearIdPedido();
    }
  }, [cart, idPedido]);
  
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad de la modal

  const handleTipoEnvioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoEnvio(e.target.value as TipoEnvio);
    console.log(e.target.value)
    if (e.target.value === TipoEnvio.DELIVERY) {
      setShowModal(true); // Si el tipo de envío es delivery, mostramos la modal
    } else {
      setShowModal(false); // Si no es delivery, ocultamos la modal
    }
  };
  const handleCloseModal = () => {
    setSelectedPais(null)
    setSelectedProvincia(null);
    setTipoEnvio(null)
    setDomicilio((prevDomicilio: any) => ({
      ...prevDomicilio,
      localidad: null,
    }));
    setShowModal(false);
  };
  const onSave = async () => {
    try {
      // const response = await domicilioService.post(url + "domicilio", domicilio);
      console.log(domicilio);
      setDomicilioCreado(true)
      setDomicilio(domicilio);
      setShowModal(false);
      console.log(domicilio);
    } catch (error) {
      console.error("Error al guardar el domicilio:", error);
    }
  };
  
  return (
    <div className="text-center">
      <label className="cart-button">
        <i>Carrito de Compras</i>
      </label>

      <aside className="cart">
        {cart.length === 0 ? (
          <p className="text-danger">Sin productos en el carrito.</p>
        ) : (
          <>
            {cart.map((detalle, index) => (
              <CartItem detalle={detalle} key={index} />
            ))}
            <div>
              <h3>${totalProductos}</h3>
              {tipoEnvio === TipoEnvio.TAKEAWAY && (
                <p className="text-success">Se ha aplicado un descuento del 10%.</p>
              )}
              {totalTiempoEspera && mostrarMensaje &&  idPedido &&(
                <p className="text-success">
                  {tipoEnvio === TipoEnvio.DELIVERY
                    ? `Tiempo estimado de entrega: ${totalTiempoEspera}`
                    : tipoEnvio === TipoEnvio.TAKEAWAY
                    ? `Tiempo estimado de retiro: ${totalTiempoEspera}`
                    : `Tiempo estimado de su pedido: ${totalTiempoEspera}`}
                </p>
              )}

            </div>
            <div className="mt-3">
              {!pedidoCreado && idPedido === undefined && (
                <button
                  className="btn btn-outline-danger"
                  onClick={limpiarCarritoYResetearIdPedido}
                  title="Limpiar Todo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="1"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M17 17a2 2 0 1 0 2 2" />
                    <path d="M17 17h-11v-11" />
                    <path d="M9.239 5.231l10.761 .769l-1 7h-2m-4 0h-7" />
                    <path d="M3 3l18 18" />
                  </svg>
                </button>
              )}
            </div>
            <select
              onChange={handleTipoEnvioChange}
              className="form-select mt-3 w-100"
            >
              <option value="">Elija un tipo de envío</option>
              <option value={TipoEnvio.TAKEAWAY}>Takeaway</option>
              <option value={TipoEnvio.DELIVERY}>Delivery</option>
            </select>
            {showModal && tipoEnvio === TipoEnvio.DELIVERY && (
              <div className="modal fade show" tabIndex={-1} style={{ display: "block" }}>
                <div className="modal-dialog modal-xl">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Ingresar Domicilio donde se llevará el pedido</h5>
                      <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                    </div>
                    <div className="modal-body">
                    <form>
                      <div className="row">
                        <div className="col-md-4">
                          <label htmlFor="paisId" className="form-label">País</label>
                          <select className="form-select" id="paisId" name="paisId" onChange={handlePaisChange} required>
                            <option value="">Seleccione un país</option>
                            {paises.map((pais) => (
                              <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="provinciaId" className="form-label">Provincia</label>
                          <select className="form-select" id="provinciaId" name="provinciaId" onChange={handleProvinciaChange} disabled={!selectedPais} required>
                            <option value="">Seleccione una provincia</option>
                            {provincias.map((provincia) => (
                              <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="localidadId" className="form-label">Nombre de Localidad</label>
                          <select className="form-select" id="localidadId" name="localidadId" onChange={handleLocalidadChange} disabled={!selectedProvincia} required>
                            <option value="">Seleccione una localidad</option>
                            {localidades.map((localidad) => (
                              <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="calle" className="form-label">Calle</label>
                          <input type="text" className="form-control" id="calle" name="calle" onChange={handleChange} disabled={!selectedLocalidad} required />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="numero" className="form-label">Numero</label>
                          <input type="number" className="form-control" id="numero" name="numero" onChange={handleChange} disabled={!selectedLocalidad} required />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="cp" className="form-label">Código Postal</label>
                          <input type="number" className="form-control" id="cp" name="cp" onChange={handleChange} disabled={!selectedLocalidad} required />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="nroDpto" className="form-label">Número de Departamento</label>
                          <input type="number" className="form-control" id="nroDpto" name="nroDpto" onChange={handleChange} disabled={!selectedLocalidad} required />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="piso" className="form-label">Piso</label>
                          <input type="number" className="form-control" id="piso" name="piso" onChange={handleChange} disabled={!selectedLocalidad} required />
                        </div>
                      </div>
                    </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                      <button type="button" className="btn btn-primary" onClick={onSave}>Guardar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!pedidoCreado && (domicilioCreado || tipoEnvio === TipoEnvio.TAKEAWAY) && idPedido === undefined && (
              <>
                <button
                  hidden={!isAuthenticated}
                  className="btn btn-outline-primary mt-3 w-100"
                  onClick={() => handleGenerarPedido(FormaPago.EFECTIVO)}
                >
                  PAGO EN EFECTIVO
                </button>
                <button
                  hidden={!isAuthenticated}
                  className="btn btn-outline-primary mt-3 w-100"
                  onClick={() => handleGenerarPedido(FormaPago.MERCADOPAGO)}
                  >
                  PAGAR CON MERCADO PAGO
                </button>
                <button
                  hidden={isAuthenticated}
                  className="btn btn-outline-primary mt-3"
                  onClick={handleLogin}
                >
                  LOGEATE PARA GENERAR EL PEDIDO
                </button>
              </>
            )}
            {idPedido && formaPago == FormaPago.MERCADOPAGO  &&<CheckoutMP idPedido={idPedido} iniciarProcesoAutomaticamente={true}/>}
            {mostrarIdPedido &&(
              <div className="text-success">
                El pedido con id {idPedido} se guardó correctamente!
              </div>
            )}
           {mostrarMensaje && (
              <div className="text-success">
                El pedido con id {idPedidoUrl} se guardó correctamente!
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
};
