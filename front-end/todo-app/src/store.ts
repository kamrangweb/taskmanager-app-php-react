import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todo-redux/TodoSlice';
import authReducer from './store/slices/authSlice';

// Create the store
export const store = configureStore({
  reducer: {
    todos: todoReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 