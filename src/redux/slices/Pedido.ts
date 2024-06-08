import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Pedido from '../../types/Pedido';

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico para Promocion[]
const initialPedidoState: IInitialState<Pedido[]> = {
  data: [],
};

export const pedidoSlice = createSlice({
  name: 'pedidoState',
  initialState: initialPedidoState,
  reducers: {
    setData: (state, action: PayloadAction<Pedido[]>) => {
      state.data = action.payload;
    },
    resetData: (state) => {
      state.data = [];
    }
  },
});

export const { setData: setPedido, resetData: resetPedido } = pedidoSlice.actions;

export default pedidoSlice.reducer;