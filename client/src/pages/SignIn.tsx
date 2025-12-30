import type { JSX } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { onGlobalError } from "../utils/global-error";
import { useUser } from "../contexts/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { UserType } from "../types/user";
import { login } from "../services/authService";
// import { mockLogin as login } from "../services/mockAutService";
import { ShieldUser, UserLock } from "lucide-react";
import { AxiosError } from "axios";

interface ISignInStateForm {
  nickname: string;
  code: string;
}

export default function SignIn(): JSX.Element {
  const [formData, setFormData] = useState<ISignInStateForm>({
    nickname: "",
    code: "",
  });
  const [loginError, setLoginError] = useState<boolean>(false);
  const userContext = useUser();
  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setLoginError(false);
  };

  const onSubmitClicked = async () => {
    if (!formData.nickname || !formData.code) return null;

    try {
      const user: UserType = await login(formData);
      userContext.login(user);
      toast.success("Logged in successfully!");
      void navigate("/");
    } catch (err) {
      console.error(err);
      let errorMsg: string = "Something went wrong.";

      if (err instanceof AxiosError && err.response) {
        const responseData = err.response.data as { message?: string };
        if (responseData.message) {
          errorMsg = responseData.message;
        }
      }

      onGlobalError(errorMsg);
      setLoginError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card p-12 bg-base-100 rounded-box border border-base-300 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome</h1>

        <fieldset className="my-2">
          <label className="label font-bold">Nickname</label>

          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <ShieldUser />
            </div>
            <input
              type="text"
              className="input-base"
              placeholder="Nickname"
              name="nickname"
              value={formData.nickname}
              onChange={onInputChange}
            />
          </div>
        </fieldset>

        <fieldset className="my-2">
          <label className="label font-bold">Password</label>

          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <UserLock />
            </div>
            <input
              type="password"
              className="input-base"
              placeholder="Code"
              name="code"
              value={formData.code}
              onChange={onInputChange}
            />
          </div>
        </fieldset>

        <button
          className="button-base mt-4"
          disabled={!formData.nickname || !formData.code}
          onClick={() => void onSubmitClicked()}
        >
          Login
        </button>

        <p className="min-h-5 text-center  text-red-600">
          {loginError ? "Invalid credentials" : ""}
        </p>

        <div className="divider divider-neutral dark:divider-primary">OR</div>

        <Link to="/signup" className="link link-hover text-center font-bold">
          Create New Account
        </Link>
      </div>
    </div>
  );
}
