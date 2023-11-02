import "./App.css";
import { useEffect } from "react";
import { TodolistsList } from "features/TodolistsList/TodolistsList";
import { useAppDispatch, useAppSelector } from "./store";
import { RequestStatusType } from "./app-reducer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { Menu } from "@mui/icons-material";
import { Login } from "features/auth/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { logOutTC, meTC } from "features/auth/auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";
import { selectIsInitialized, selectStatus } from "./app-selectors";
import { ErrorSnackbar } from "common/components";
import { selectIsLoggedIn } from "features/auth/auth-selectors";

function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector<RequestStatusType>(selectStatus);
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const isInitialized = useAppSelector<boolean>(selectIsInitialized);

  const logOutHandler = () => {
    dispatch(logOutTC());
  };

  useEffect(() => {
    dispatch(meTC());
  }, []);

  if (!isInitialized) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logOutHandler}>
              Logout
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
          {/* <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} /> */}
          <Route path={"*"} element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
