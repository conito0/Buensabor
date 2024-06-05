import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Empresa from "../../types/Empresa.ts";

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico para Promocion[]
const initialEmpresaState: IInitialState<Empresa[]> = {
  data: [],
};

export const empresasSlice = createSlice({
  name: 'empresaState',
  initialState: initialEmpresaState,
  reducers: {
    setData: (state, action: PayloadAction<Empresa[]>) => {
      state.data = action.payload;
    },
    resetData: (state) => {
      state.data = [];
    }
  },
});

export const { setData: setEmpresa, resetData: resetEmpresa } = empresasSlice.actions;

export default empresasSlice.reducer;