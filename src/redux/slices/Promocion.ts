import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Promocion from '../../types/Promocion';

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico para Promocion[]
const initialPromocionState: IInitialState<Promocion[]> = {
  data: [],
};

export const promocionSlice = createSlice({
  name: 'promocionState',
  initialState: initialPromocionState,
  reducers: {
    setData: (state, action: PayloadAction<Promocion[]>) => {
      state.data = action.payload;
    },
    resetData: (state) => {
      state.data = [];
    }
  },
});

export const { setData: setPromocion, resetData: resetPromocion } = promocionSlice.actions;

export default promocionSlice.reducer;