import type { JSX } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { signUp } from "../services/authService";
import { isValidEmail } from '../utils/validators';
import toast from 'react-hot-toast';
import { CodeModal } from '../components/CodeModal';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { mockSignUp as signUp1 } from '../services/mockAutService';
import { ShieldUser, Mail } from 'lucide-react';

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
    nickname: 'test',
    email: 'test@test.com',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isNicknameError, setIsNicknameError] = useState<boolean>(false);
  // const [isEmailError, setIsEmailError] = useState<boolean>(false);
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
    // setIsNicknameError(false);
    // setIsEmailError(false);

    if (!isValidEmail(formData.email)) {
      // setIsEmailError(true);
      setIsLoading(false);
      return;
    }

    try {
      const { user, code } = await signUp1(formData);

      if (code && user) {
        setShowModal(true);
        setNewUserData({
          nickname: user.nickname,
          code: code,
        });
      } else {
        throw new Error('Something went wrong!!');
      }
    } catch (err: unknown) {
      // Use unknown instead of any
      // Check if it's an AxiosError
      if (err instanceof AxiosError) {
        const res = err.response;
        console.error('error ===>', res);
        // const errMsg = res?.data?.message || err.message;

        // toast.error(errMsg, {
        //   style: {
        //     borderRadius: '10px',
        //     background: '#333',
        //     color: '#fff',
        //   },
        // });

        // if (res) {
        //   const { status, data } = res;
        //   const message = (data.message || '').toLowerCase();

        //   if (status === 409) {
        //     if (message.includes('email')) {
        //       setIsEmailError(true);
        //     } else if (message.includes('nickname')) {
        //       setIsNicknameError(true);
        //     }
        //   }
        // }
      } else if (err instanceof Error) {
        // Handle non-Axios errors
        toast.error(err.message, {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        // Handle unknown error types
        toast.error('An unknown error occurred', {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onModalClose = () => {
    setShowModal(false);
    void navigate('/signin');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card p-12 bg-base-100 rounded-box border border-base-300 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>

        <fieldset className="my-2">
          <label className="label font-bold">Nickname</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <ShieldUser />
            </div>
            <input
              type="text"
              // className={`input ${isNicknameError && 'input-error'}`}
              className="input-base"
              placeholder="Nickname"
              name="nickname"
              value={formData.nickname}
              onChange={onInputChange}
              // onFocus={() => setIsNicknameError(false)}
            />
            {/* {isNicknameError && (
          <label className="label text-red-600">
            Nickname is already being used
          </label>
        )} */}
          </div>
        </fieldset>

        <fieldset className="my-2">
          <label className="label font-bold">Email</label>

          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Mail />
            </div>

            <input
              type="email"
              // className={`input ${isEmailError && 'input-error'}`}
              className="input-base"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              // onFocus={() => setIsEmailError(false)}
            />
            {/* {isEmailError && (
          <label className="label text-red-600">
            Email is already being used
          </label>
        )} */}
          </div>
        </fieldset>

        <button
          // className="btn btn-outline btn-secondary mt-4"
          className="button-base mt-4"
          disabled={!formData.nickname || !formData.email || isLoading}
          onClick={() => void onSubmitClicked()}
        >
          {isLoading ? (
            <span className="loading loading-ring loading-lg"></span>
          ) : (
            <span className="text-lg">Create Account</span>
          )}
        </button>

        <div className="divider bg-base-100">OR</div>
        <p className="text-center">Do you already have an account?</p>

        <Link to="/signin" className="link link-hover text-center font-bold">
          Log In
        </Link>
      </div>

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
