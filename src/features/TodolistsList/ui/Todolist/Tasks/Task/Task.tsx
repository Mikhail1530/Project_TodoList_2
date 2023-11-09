import React, { ChangeEvent, memo } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { EditableSpan } from "common/components";
import { TaskStatuses } from "common/enums";
import { TaskType } from "../../../../api/tasks/tasks.types";
import { useActions } from "../../../../../../common/hooks";
import { tasksThunks } from "../../../../model/tasks/tasks.reducer";
import s from "./Task.module.css";

type Props = {
  task: TaskType;
  todolistId: string;
};

export const Task = memo(({ task, todolistId }: Props) => {
  const { removeTask: removeTaskThunk, updateTask } = useActions(tasksThunks);
  const taskId = task.id;
  const handleTaskRemoved = () => {
    removeTaskThunk({ taskId, todolistId });
  };

  const handleTaskStatusChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({ taskId, domainModel: { status }, todolistId });
  };

  const handleTaskTitleChange = (title: string) => {
    updateTask({ taskId, domainModel: { title }, todolistId });
  };

  const isDone = task.status === TaskStatuses.Completed;

  return (
    <div key={task.id} className={isDone ? s.isDone : ""}>
      <Checkbox checked={isDone} color="primary" onChange={handleTaskStatusChanged} />

      <EditableSpan value={task.title} onChange={handleTaskTitleChange} />
      <IconButton onClick={handleTaskRemoved}>
        <Delete />
      </IconButton>
    </div>
  );
});
