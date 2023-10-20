import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { AppRootStateType, AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTodolistsTC, todolistsActions } from "./todolists-reducer";

export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  const res = await todolistsAPI.getTasks(todolistId);
  const tasks = res.data.items;
  thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
  return { tasks, todolistId };
});
export const removeTaskTC = createAsyncThunk(
  "tasks/removeTask",
  async (param: { taskId: string; todolistId: string }) => {
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId);
    return { taskId: param.taskId, todolistId: param.todolistId };
  }
);
export const addTaskTC = createAsyncThunk(
  "tasks/addTask",
  async (param: { title: string; todolistId: string }, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.createTask(param.todolistId, param.title);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error.message, dispatch);
      return rejectWithValue(null);
    }
  }
);
export const updateTaskTC = createAsyncThunk(
  "tasks/updateTask",
  async (param: { taskId: string; model: UpdateDomainTaskModelType; todolistId: string }, thunkAPI) => {
    const state = thunkAPI.getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find((t) => t.id === param.taskId);
    if (!task) {
      return thunkAPI.rejectWithValue("task not found in the state");
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...param.model,
    };
    const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel);
    try {
      if (res.data.resultCode === 0) {
        return param;
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    // removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
    //   const tasksForTodolist = state[action.payload.todolistId];
    //   const index = tasksForTodolist.findIndex((t) => t.id === action.payload.taskId);
    //   if (index !== 1) tasksForTodolist.splice(index, 1);
    // },
    // addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
    //   const tasksForTodolist = state[action.payload.task.todoListId];
    //   tasksForTodolist.unshift(action.payload.task);
    // },
    // updateTask: (
    //   state,
    //   action: PayloadAction<{
    //     taskId: string;
    //     model: UpdateDomainTaskModelType;
    //     todolistId: string;
    //   }>
    // ) => {
    //   const tasksForTodolist = state[action.payload.todolistId];
    //   const index = tasksForTodolist.findIndex((t) => t.id === action.payload.taskId);
    //   if (index !== -1)
    //     tasksForTodolist[index] = {
    //       ...tasksForTodolist[index],
    //       ...action.payload.model,
    //     };
    // },
    // setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>) => {
    //   state[action.payload.todolistId] = action.payload.tasks;
    // },
    setNullTasks: (state, action: PayloadAction) => {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasksForTodolist = state[action.payload.todolistId];
        const index = tasksForTodolist.findIndex((t) => t.id === action.payload.taskId);
        if (index !== 1) tasksForTodolist.splice(index, 1);
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        const tasksForTodolist = state[action.payload.task.todoListId];
        tasksForTodolist.unshift(action.payload.task);
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasksForTodolist = state[action.payload.todolistId];
        const index = tasksForTodolist.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1)
          tasksForTodolist[index] = {
            ...tasksForTodolist[index],
            ...action.payload.model,
          };
      });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: TaskType[];
};
// thunks
// export const fetchTasksTC_ =
//   (todolistId: string): AppThunk =>
//   (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: "loading" }));
//     todolistsAPI.getTasks(todolistId).then((res) => {
//       const tasks = res.data.items;
//       dispatch(tasksActions.setTasks({ tasks, todolistId }));
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//     });
//   };
// export const removeTaskTC_ =
//   (taskId: string, todolistId: string): AppThunk =>
//   (dispatch) => {
//     todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
//       dispatch(tasksActions.removeTask({ taskId, todolistId }));
//     });
//   };
// export const addTaskTC_ =
//   (title: string, todolistId: string): AppThunk =>
//   (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: "loading" }));
//     todolistsAPI
//       .createTask(todolistId, title)
//       .then((res) => {
//         if (res.data.resultCode === 0) {
//           dispatch(tasksActions.addTask({ task: res.data.data.item }));
//           dispatch(appActions.setAppStatus({ status: "succeeded" }));
//         } else {
//           handleServerAppError(res.data, dispatch);
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// export const updateTaskTC_ =
//   (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
//   (dispatch, getState) => {
//     const state = getState();
//     const task = state.tasks[todolistId].find((t) => t.id === taskId);
//     if (!task) {
//       //throw new Error("task not found in the state");
//       console.warn("task not found in the state");
//       return;
//     }

//     const apiModel: UpdateTaskModelType = {
//       deadline: task.deadline,
//       description: task.description,
//       priority: task.priority,
//       startDate: task.startDate,
//       title: task.title,
//       status: task.status,
//       ...domainModel,
//     };

//     todolistsAPI
//       .updateTask(todolistId, taskId, apiModel)
//       .then((res) => {
//         if (res.data.resultCode === 0) {
//           const action = tasksActions.updateTask({
//             taskId,
//             model: domainModel,
//             todolistId,
//           });
//           dispatch(action);
//         } else {
//           handleServerAppError(res.data, dispatch);
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// types

// export const _tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
//   switch (action.type) {
//     case "REMOVE-TASK":
//       return { ...state, [action.todolistId]: state[action.todolistId].filter((t) => t.id !== action.taskId) };
//     case "ADD-TASK":
//       return { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] };
//     case "UPDATE-TASK":
//       return {
//         ...state,
//         [action.todolistId]: state[action.todolistId].map((t) =>
//           t.id === action.taskId ? { ...t, ...action.model } : t,
//         ),
//       };
//     case "ADD-TODOLIST":
//       return { ...state, [action.todolist.id]: [] };
//     case "REMOVE-TODOLIST":
//       const copyState = { ...state };
//       delete copyState[action.id];
//       return copyState;
//     case "SET-TODOLISTS": {
//       const copyState = { ...state };
//       action.todolists.forEach((tl: any) => {
//         copyState[tl.id] = [];
//       });
//       return copyState;
//     }
//     case "SET-TASKS":
//       return { ...state, [action.todolistId]: action.tasks };
//     default:
//       return state;
//   }
// };

// // actions
// export const removeTaskAC = (taskId: string, todolistId: string) =>
//   ({ type: "REMOVE-TASK", taskId, todolistId }) as const;
// export const addTaskAC = (task: TaskType) => ({ type: "ADD-TASK", task }) as const;
// export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
//   ({
//     type: "UPDATE-TASK",
//     model,
//     todolistId,
//     taskId,
//   }) as const;
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
// ({
//   type: "SET-TASKS",
//   tasks,
//   todolistId,
// }) as const;
// type ActionsType =
//   | ReturnType<typeof removeTaskAC>
//   | ReturnType<typeof addTaskAC>
//   | ReturnType<typeof updateTaskAC>
//   | ReturnType<typeof setTasksAC>
//   | any;
// const initialState: TasksStateType = {};
