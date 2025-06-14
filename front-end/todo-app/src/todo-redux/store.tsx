import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './TodoSlice';

const store = configureStore({
  reducer: {
    todos: todoSlice,
    
  },
});

export default store;