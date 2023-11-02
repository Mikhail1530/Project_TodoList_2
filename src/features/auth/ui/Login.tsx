import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import { useLogin } from "../lib/useLogin";

export const Login = () => {
  const { formik, isLoggedIn } = useLogin();

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
              {formik.touched.email && formik.errors.email && (
                <span style={{ color: "red" }}>{formik.errors.email}</span>
              )}
              <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
              {formik.touched.password && formik.errors.password && (
                <span style={{ color: "red" }}>{formik.errors.password}</span>
              )}
              <FormControlLabel label={"Remember me"} control={<Checkbox {...formik.getFieldProps("rememberMe")} />} />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  );
};
