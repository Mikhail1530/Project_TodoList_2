import { TaskPriorities, TaskStatuses } from "common/enums/common.enums";
import { UpdateDomainTaskModelType } from "features/TodolistsList/model/tasks/tasks.reducer";

// Types
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};

export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};

export type AddTaskArgType = {
  title: string;
  todolistId: string;
};

export type UpdateTaskArgType = {
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
  todolistId: string;
};

export type RemoveTaskArgType = {
  todolistId: string;
  taskId: string;
};

export type UpdateTodolistTitleArgType = {
  id: string;
  title: string;
};
