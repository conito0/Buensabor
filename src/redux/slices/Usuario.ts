import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UsuarioTypes from "../../types/Usuario.ts";

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico
const usuarioState: IInitialState<UsuarioTypes[]> = {
  data: [],
};

export const usuarioSlice = createSlice({
  name: 'usuarioState',
  initialState: usuarioState,
  reducers: {
    setData: (state, action: PayloadAction<UsuarioTypes[]>) => {
      state.data = action.payload;
    },
    resetData: (state) => {
      state.data = [];
    }
  },
});

export const { setData: setUsuario, resetData: resetUsuario } = usuarioSlice.actions;

export default usuarioSlice.reducer;