import { FieldsErrorType, authAPI } from "features/TodolistsList/api/todolists-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/model/app-reducer";
import { todolistsActions } from "features/TodolistsList/model/todolists-reducer";
import { tasksActions } from "features/TodolistsList/model/tasks-reducer";
import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { LoginDataType } from "../lib/useLogin";

// reducer from redux-toolkit

export const loginTC = createAsyncThunk<
  undefined,
  LoginDataType,
  { rejectValue: { errors: string[]; fieldsErrors?: FieldsErrorType[] } }
>("auth/login", async (param, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
    }
  } catch (e: any) {
    // const e: AxiosError = error;
    handleServerNetworkError(e as { message: string }, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({ errors: [e], fieldsErrors: undefined });
    // return thunkAPI.rejectWithValue({ isLoggedIn: false });
  }
});

export const logOutTC = createAsyncThunk("auth/logout", async (param, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const result = await authAPI.logOut();
    if (result.data.resultCode === 0) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      thunkAPI.dispatch(todolistsActions.setNullState());
      thunkAPI.dispatch(tasksActions.setNullTasks());
      return;
    } else {
      handleServerAppError(result.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  }
});

export const meTC = createAsyncThunk("auth/me", async (param, { dispatch, rejectWithValue }) => {
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      return;
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue({});
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, dispatch);
    return rejectWithValue({});
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
});

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logOutTC.fulfilled, (state) => {
      state.isLoggedIn = false;
    });
    builder.addCase(meTC.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
  },
});

export const authReducer = slice.reducer;

// thunks

// export const loginTC_ =
//   (data: LoginDataType): AppThunk =>
//   async (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: "loading" }));
//     try {
//       const result = await authAPI.login(data);
//       if (result.data.resultCode === 0) {
//         dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       } else {
//         handleServerAppError(result.data, dispatch);
//       }
//     } catch (e) {
//       handleServerNetworkError(e as { message: string }, dispatch);
//     }
//   };
// export const logOutTC_ = (): AppThunk => async (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   try {
//     const result = await authAPI.logOut();
//     if (result.data.resultCode === 0) {
//       dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       dispatch(todolistsActions.setNullState());
//       dispatch(tasksActions.setNullTasks());
//     } else {
//       handleServerAppError(result.data, dispatch);
//     }
//   } catch (e) {
//     handleServerNetworkError(e as { message: string }, dispatch);
//   }
// };
// export const meTC_ = (): AppThunk => async (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   try {
//     const result = await authAPI.me();
//     if (result.data.resultCode === 0) {
//       dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//     } else {
//       handleServerAppError(result.data, dispatch);
//     }
//   } catch (e) {
//     handleServerNetworkError(e as { message: string }, dispatch);
//   } finally {
//     dispatch(appActions.setIsInitialized({ isInitialized: true }));
//   }
// };

// const initialState = {
//   isLoggedIn: false,
// };
// type InitialStateType = typeof initialState;
// redux reducer

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case "login/SET-IS-LOGGED-IN":
//       return { ...state, isLoggedIn: action.value };
//     default:
//       return state;
//   }
// };
// actions
// export const setIsLoggedInAC = (value: boolean) => ({ type: "login/SET-IS-LOGGED-IN", value }) as const;

// types
// type ActionsType =
//   | ReturnType<typeof setIsLoggedInAC>
//   | SetAppStatusActionType
//   | SetAppErrorActionType
//   | SetIsInitializedType;
