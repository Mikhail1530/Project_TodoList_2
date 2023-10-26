import { FieldsErrorType, authAPI } from "api/todolists-api";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { LoginDataType } from "./Login";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { tasksActions } from "features/TodolistsList/tasks-reducer";
import { handleServerAppError } from "common/utils/handleServerAppError";

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

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logOutTC.fulfilled, (state) => {
      state.isLoggedIn = false;
    });
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

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
export const meTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const result = await authAPI.me();
    if (result.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(result.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, dispatch);
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
};

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
