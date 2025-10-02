import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../services/authService";

interface ISignUpStateForm {
  nickname: string;
  email: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<ISignUpStateForm>({
    nickname: "jorge1o",
    email: "vargklee@hotmail.com",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNicknameError, setIsNicknameError] = useState<boolean>(false);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmitClicked = async () => {
    setIsLoading(true);
    setIsNicknameError(false);
    setIsEmailError(false);

    try {
      const res = await signUp(formData);

      console.log("SignUp Response: ", res);
    } catch (err: any) {
      console.error("error ===>", err);
      const res = err.response;

      if (res) {
        const { status } = res;

        if (status === 409) {
          setIsEmailError(true);
          setIsNicknameError(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend text-2xl">Sign Up</legend>

        <label className="label">Nickname</label>
        <input
          type="text"
          className={`input ${isNicknameError && "input-error"}`}
          placeholder="Nickname"
          name="nickname"
          value={formData.nickname}
          onChange={onInputChange}
          onFocus={() => setIsNicknameError(false)}
        />
        {isNicknameError && (
          <label className="label text-red-600">
            Nick is already being used
          </label>
        )}

        <label className="label">Email</label>
        <input
          type="email"
          className={`input ${isEmailError && "input-error"}`}
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
        />
        {isEmailError && (
          <label className="label text-red-600">
            Email is already being used
          </label>
        )}

        <button
          className="btn btn-secondary mt-4"
          disabled={!formData.nickname || !formData.email || isLoading}
          onClick={onSubmitClicked}
        >
          {isLoading ? (
            <span className="loading loading-ring loading-xl"></span>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center">Do you already have an account?</p>
        <Link to="/signin" className="link link-secondary text-center">
          Log In
        </Link>
      </fieldset>
    </div>
  );
}
