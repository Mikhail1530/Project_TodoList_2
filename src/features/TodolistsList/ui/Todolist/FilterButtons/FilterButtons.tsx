import React, { MouseEventHandler } from "react";
import { Button } from "@mui/material";
import { FilterValuesType, TodolistFilter } from "../../../model/todolists/todolists.reducer";

type Props = {
  filter: FilterValuesType;
  changeFilter: (filter: TodolistFilter) => void;
};

export const FilterButtons = ({ filter, changeFilter }: Props) => {
  const handleFilterButtonClicked: MouseEventHandler<HTMLButtonElement> = (e) => {
    const filter = e.currentTarget.value as TodolistFilter;
    if (!Object.values(TodolistFilter).includes(filter)) {
      throw new Error(`Filter value is not allowed: ${filter}`);
    }
    changeFilter(filter);
  };

  return (
    <>
      <Button
        variant={filter === "all" ? "outlined" : "text"}
        onClick={handleFilterButtonClicked}
        color={"inherit"}
        value={TodolistFilter.All}
      >
        All
      </Button>
      <Button
        onClick={handleFilterButtonClicked}
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        value={TodolistFilter.Active}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        onClick={handleFilterButtonClicked}
        color={"secondary"}
        value={TodolistFilter.Completed}
      >
        Completed
      </Button>
    </>
  );
};
