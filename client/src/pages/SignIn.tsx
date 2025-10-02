import { useState } from "react";
import { Link } from "react-router-dom";

interface ISignInStateForm {
  nickname: string;
  code: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<ISignInStateForm>({
    nickname: "",
    code: "",
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmitClicked = () => {
    console.table(formData);
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

        <p className="text-center">Or</p>
        {/* <p>Create New Account</p> */}
        <Link to="/signup" className="link link-secondary text-center">
          Create New Account
        </Link>
      </fieldset>
    </div>
  );
}
