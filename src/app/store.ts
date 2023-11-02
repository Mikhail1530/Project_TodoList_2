import { tasksReducer } from "features/TodolistsList/model/tasks-reducer";
import { todolistsReducer } from "features/TodolistsList/model/todolists-reducer";
import { AnyAction, combineReducers } from "redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { appReducer } from "./model/app-reducer";
import { authReducer } from "features/auth/model/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

// const rootReducer = combineReducers({
//   tasks: tasksReducer,
//   todolists: todolistsReducer,
//   app: appReducer,
//   auth: authReducer,
// });

//  const _store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
