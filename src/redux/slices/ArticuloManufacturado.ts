import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ArticuloManufacturado from "../../types/ArticuloManufacturado.ts";

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico para Promocion[]
const initialArticuloManufacturado: IInitialState<ArticuloManufacturado[]> = {
  data: [],
};

export const articuloManufacturadoSlice = createSlice({
  name: 'articuloManufacturadoState',
  initialState: initialArticuloManufacturado,
  reducers: {
    setData: (state, action: PayloadAction<ArticuloManufacturado[]>) => {
      state.data = action.payload;
    },
    resetData: (state) => {
      state.data = [];
    }
  },
});

export const { setData: setArticuloManufacturado, resetData: resetArticuloManufacturado } = articuloManufacturadoSlice.actions;

export default articuloManufacturadoSlice.reducer;