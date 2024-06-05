import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cupones from "../../types/Cupones.ts";

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico para Promocion[]
const initialPromocionState: IInitialState<Cupones[]> = {
  data: [],
};

export const cuponesSlice = createSlice({
  name: 'cuponState',
  initialState: initialPromocionState,
  reducers: {
    setData: (state, action: PayloadAction<Cupones[]>) => {
      state.data = action.payload;
    },
    resetData: (state) => {
      state.data = [];
    }
  },
});

export const { setData: setCupon, resetData: resetCupon } = cuponesSlice.actions;

export default cuponesSlice.reducer;