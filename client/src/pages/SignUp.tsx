import type { JSX } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../services/authService";
import { isValidEmail } from "../utils/validators";
import toast, { Toaster } from "react-hot-toast";
import { CodeModal } from "../components/CodeModal";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface ISignUpStateForm {
  nickname: string;
  email: string;
}

interface INewUser {
  nickname: string;
  code: string;
}

export default function SignUp(): JSX.Element {
  const [formData, setFormData] = useState<ISignUpStateForm>({
    nickname: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNicknameError, setIsNicknameError] = useState<boolean>(false);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newUserData, setNewUserData] = useState<INewUser | null>(null);
  const navigate = useNavigate();

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

    if (!isValidEmail(formData.email)) {
      setIsEmailError(true);
      setIsLoading(false);
      return;
    }

    try {
      const { user, code } = await signUp(formData);

      if (code && user) {
        setShowModal(true);
        setNewUserData({
          nickname: user.nickname,
          code: code,
        });
      } else {
        throw new Error("Something went wrong!!");
      }
    } catch (err: unknown) {
      // Use unknown instead of any
      // Check if it's an AxiosError
      if (err instanceof AxiosError) {
        const res = err.response;
        console.error("error ===>", res);
        const errMsg = res?.data?.message || err.message;

        toast.error(errMsg, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        if (res) {
          const { status, data } = res;
          const message = (data.message || "").toLowerCase();

          if (status === 409) {
            if (message.includes("email")) {
              setIsEmailError(true);
            } else if (message.includes("nickname")) {
              setIsNicknameError(true);
            }
          }
        }
      } else if (err instanceof Error) {
        // Handle non-Axios errors
        toast.error(err.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        // Handle unknown error types
        toast.error("An unknown error occurred", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onModalClose = () => {
    setShowModal(false);
    void navigate("/signin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend text-2xl">Sign Up</legend>

        <label className="label text-secondary">Nickname</label>
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
            Nickname is already being used
          </label>
        )}

        <label className="label text-secondary">Email</label>
        <input
          type="email"
          className={`input ${isEmailError && "input-error"}`}
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          onFocus={() => setIsEmailError(false)}
        />
        {isEmailError && (
          <label className="label text-red-600">
            Email is already being used
          </label>
        )}

        <button
          className="btn btn-outline btn-secondary mt-4"
          disabled={!formData.nickname || !formData.email || isLoading}
          onClick={() => void onSubmitClicked()}
        >
          {isLoading ? (
            <span className="loading loading-ring loading-xl"></span>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="divider divider-secondary">OR</div>
        <p className="text-center">Do you already have an account?</p>
        <Link to="/signin" className="link link-secondary text-center">
          Log In
        </Link>
      </fieldset>

      <Toaster position="top-right" />

      {newUserData && showModal && (
        <CodeModal
          nickname={newUserData.nickname}
          code={newUserData.code}
          isOpen={showModal}
          onClose={onModalClose}
        />
      )}
    </div>
  );
}
