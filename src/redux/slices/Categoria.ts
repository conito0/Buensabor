import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Categoria from "../../types/Categoria.ts";

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Estado inicial específico para Promocion[]
const initialCategoriaState: IInitialState<Categoria[]> = {
  data: [],
};

export const categoriaSlice = createSlice({
  name: 'categoriaState',
  initialState: initialCategoriaState,
  reducers: {
    setData: (state, action: PayloadAction<Categoria[]>) => {
      state.data = action.payload;
    },
    resetData: (state) => {
      state.data = [];
    }
  },
});

export const { setData: setCategoria, resetData: resetCategoria } = categoriaSlice.actions;

export default categoriaSlice.reducer;