import { useCarrito } from "../../../hooks/useHooks"

export const Carrito = () => {
    const { cart } = useCarrito()

    console.log(cart)

    return <>
        <div onClick={() => console.log(cart)}>hola</div>
        {cart.map((value) => <>
            <div>{value.articulo.denominacion} x{value.cantidad}</div>
        </>)}
    </>
}