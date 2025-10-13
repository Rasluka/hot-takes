import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";
import { onGlobalError } from "../utils/global-error";

interface ISignInStateForm {
  nickname: string;
  code: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<ISignInStateForm>({
    nickname: "jorgeobando1234",
    code: "JLICJRHR",
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmitClicked = async () => {
    console.table(formData);

    if (!formData.nickname || !formData.code) return null;

    try {
      const res = await login(formData);

      console.log(res);
    } catch (err) {
      console.error(err);

      onGlobalError("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend text-2xl">Sign In</legend>

        <label className="label">Nickname</label>
        <input
          type="text"
          className="input"
          placeholder="Nickname"
          name="nickname"
          value={formData.nickname}
          onChange={onInputChange}
        />

        <label className="label">Code</label>
        <input
          type="password"
          className="input"
          placeholder="Code"
          name="code"
          value={formData.code}
          onChange={onInputChange}
        />

        <button
          className="btn btn-secondary mt-4"
          disabled={!formData.nickname || !formData.code}
          onClick={onSubmitClicked}
        >
          Login
        </button>

        <div className="divider divider-secondary">OR</div>

        <Link to="/signup" className="link link-secondary text-center">
          Create New Account
        </Link>
      </fieldset>
    </div>
  );
}
