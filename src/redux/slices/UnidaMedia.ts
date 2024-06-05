// redux/slices/unidadMedidaSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UnidadMedida from '../../types/UnidadMedida';


// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico
const unidadMedidaState: IInitialState<UnidadMedida[]> = {
  data: [],
};

export const unidadMedidaSlice = createSlice({
  name: 'unidadMedida',
  initialState: unidadMedidaState,
  reducers: {
    setUnidades: (state, action: PayloadAction<UnidadMedida[]>) => {
      state.data = action.payload;
    },
    resetUnidades: (state) => {
      state.data = [];
    }
  },
});

export const { setUnidades, resetUnidades } = unidadMedidaSlice.actions;

export default unidadMedidaSlice.reducer;
