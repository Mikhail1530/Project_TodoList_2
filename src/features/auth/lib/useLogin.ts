import { useAppDispatch, useAppSelector } from "app/store";
import { FormikHelpers, useFormik } from "formik";
import { loginTC } from "../model/auth-reducer";
import { selectIsLoggedIn } from "../model/auth-selectors";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorsType = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 5) {
        errors.password = "Should be more then 5 symbols";
      }
      return errors;
    },
    onSubmit: async (values: LoginDataType, formikHelpers: FormikHelpers<LoginDataType>) => {
      const action = await dispatch(loginTC(values));
      if (loginTC.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload?.fieldsErrors[0];
          formikHelpers.setFieldError(error.field, error.error);
        }
      }
      formik.resetForm();
    },
    // onSubmit: (values, formikHelpers: FormikHelpers<LoginDataType>) => {
    //   dispatch(loginTC(values))
    //     .unwrap()
    //     .catch((e: BaseResponseType) => {
    //       formikHelpers.setFieldError(e.fieldsErrors[0].field, e.fieldsErrors[0].error);
    //     });
    //   formik.resetForm();
    // },
  });
  return { formik, isLoggedIn };
};

// two variants of errorType
export type FormikErrorsType = Partial<Omit<LoginDataType, "captcha">>;

// type FormikErrorsType = {
//   email?: string;
//   password?: string;
//   rememberMe?: boolean;
// };

export type LoginDataType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
export type BaseResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: FieldsErrorType[];
  data: D;
};
type FieldsErrorType = {
  field: string;
  error: string;
};
