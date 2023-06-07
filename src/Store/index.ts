import { configureStore } from "@reduxjs/toolkit";
import { configSlice } from "../Reducers";
import thunk from "redux-thunk";

export const store = configureStore({
  reducer: {
    config: configSlice.reducer,
  },
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
