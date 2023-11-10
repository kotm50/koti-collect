import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storageSession from "redux-persist/lib/storage/session"; // 세션 스토리지를 가져옵니다.
import userSlice from "./userSlice";

const reducers = combineReducers({
  user: userSlice,
});

const persistConfig = {
  key: "root",
  storage: storageSession, // 세션 스토리지로 변경합니다.
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
