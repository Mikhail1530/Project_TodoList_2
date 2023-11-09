import React, { useCallback } from "react";
import { EditableSpan } from "../../../../../common/components";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useActions } from "../../../../../common/hooks";
import { todolistsThunks } from "../../../model/todolists/todolists.reducer";

type Props = {
  title: string;
  todolistId: string;
  deleteButtonDisabled: boolean;
};

export const TodolistHeader = ({ title, todolistId, deleteButtonDisabled }: Props) => {
  const { changeTodolistTitle: changeTodolistTitleThunk, removeTodolist: removeTodolistThunk } =
    useActions(todolistsThunks);

  const changeTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitleThunk({ id: todolistId, title });
    },
    [todolistId, changeTodolistTitleThunk],
  );
  const removeTodolist = () => removeTodolistThunk(todolistId);

  return (
    <h3>
      <EditableSpan value={title} onChange={changeTodolistTitle} />
      <IconButton onClick={removeTodolist} disabled={deleteButtonDisabled}>
        <Delete />
      </IconButton>
    </h3>
  );
};
