import React, { useCallback, useEffect } from "react";
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from "features/TodolistsList/model/todolists/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks.reducer";
import { useActions } from "common/hooks";
import { AddItemForm } from "common/components";
import { FilterButtons } from "./FilterButtons/FilterButtons";
import { Tasks } from "./Tasks/Tasks";
import { TodolistHeader } from "./TodolistHeader/TodolistHeader";

type Props = {
  todolist: TodolistDomainType;
};

export const Todolist = React.memo(function ({ todolist }: Props) {
  const { fetchTasks } = useActions(tasksThunks);
  const { changeTodolistFilter } = useActions(todolistsActions);

  useEffect(() => {
    fetchTasks(todolist.id);
  }, []);

  const { addTask: addTaskThunk } = useActions(tasksThunks);

  const addTask = useCallback(
    function (title: string) {
      return addTaskThunk({ title, todolistId: todolist.id }).unwrap();
    },
    [todolist.id],
  );

  const handleFilterChanged = (filter: FilterValuesType) => {
    changeTodolistFilter({ id: todolist.id, filter });
  };

  return (
    <div>
      <TodolistHeader
        title={todolist.title}
        todolistId={todolist.id}
        deleteButtonDisabled={todolist.entityStatus === "loading"}
      />
      <AddItemForm addItem={addTask} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolistId={todolist.id} filter={todolist.filter} />
      <div style={{ marginTop: "10px" }}>
        <FilterButtons filter={todolist.filter} changeFilter={handleFilterChanged} />
      </div>
    </div>
  );
});
