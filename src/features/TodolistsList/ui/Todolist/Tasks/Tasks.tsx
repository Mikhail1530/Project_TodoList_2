import { Task } from "./Task/Task";
import React from "react";
import { TaskType } from "../../../api/tasks/tasks.types";
import { TaskStatuses } from "../../../../../common/enums";
import { FilterValuesType, TodolistFilter } from "../../../model/todolists/todolists.reducer";
import { useSelector } from "react-redux";
import { selectTasks } from "../../../model/tasks/tasks.selectors";

type Props = {
  todolistId: string;
  filter: FilterValuesType;
};

const TaskStatusToFilterMap = {
  [TodolistFilter.All]: () => true,
  [TodolistFilter.Completed]: (t: TaskType) => t.status === TaskStatuses.Completed,
  [TodolistFilter.Active]: (t: TaskType) => t.status === TaskStatuses.New,
};

export const Tasks = ({ todolistId, filter }: Props) => {
  const allTasks = useSelector(selectTasks);
  const tasks = allTasks[todolistId];
  const tasksForTodolist = tasks.filter(TaskStatusToFilterMap[filter]);

  return (
    <div>
      {tasksForTodolist.map((t) => (
        <Task key={t.id} task={t} todolistId={todolistId} />
      ))}
    </div>
  );
};
