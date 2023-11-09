import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../model/auth.selectors";
import { useActions } from "../../../../common/hooks";
import { authThunks } from "../../model/auth.slice";
import { LoginParamsType } from "../../api/auth.api";
import { FormikHelpers } from "formik";
import { BaseResponseType } from "../../../../common/types";
import { useLoginForm } from "./use-login-form";

export const useLogin = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { login } = useActions(authThunks);
  const handleSubmit = (values: LoginParamsType, formikHelpers: FormikHelpers<LoginParamsType>) => {
    login(values)
      .unwrap()
      .catch((reason: BaseResponseType) => {
        reason.fieldsErrors?.forEach((fieldError) => {
          formikHelpers.setFieldError(fieldError.field, fieldError.error);
        });
      });
  };

  const { formik } = useLoginForm(handleSubmit);
  return { formik, isLoggedIn };
};
