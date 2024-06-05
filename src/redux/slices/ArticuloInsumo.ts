import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IArticuloInsumo from "../../types/ArticuloInsumoType.ts";

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico para Promocion[]
const initialArticuloInsumoState: IInitialState<IArticuloInsumo[]> = {
  data: [],
};

export const articuloInsumoSlice = createSlice({
  name: 'articuloInsumoState',
  initialState: initialArticuloInsumoState,
  reducers: {
    setData: (state, action: PayloadAction<IArticuloInsumo[]>) => {
      state.data = action.payload;
    },
    resetData: (state) => {
      state.data = [];
    }
  },
});

export const { setData: setArticuloInsumo, resetData: resetArticuloInsumo } = articuloInsumoSlice.actions;

export default articuloInsumoSlice.reducer;