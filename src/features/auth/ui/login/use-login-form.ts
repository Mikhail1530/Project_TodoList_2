import { FormikHelpers, useFormik } from "formik";
import { LoginParamsType } from "../../api/auth.api";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const useLoginForm = (
  onSubmit: (
    values: {
      email: string;
      password: string;
      rememberMe: boolean;
    },
    formikHelpers: FormikHelpers<LoginParamsType>,
  ) => void,
) => {
  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 3) {
        errors.password = "Must be 3 characters or more";
      }

      return errors;
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: onSubmit,
  });

  return { formik };
};
