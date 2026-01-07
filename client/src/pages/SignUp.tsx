import type { JSX } from 'react';
// import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { isValidEmail } from '../utils/validators';
// import toast from 'react-hot-toast';
// import { CodeModal } from '../components/CodeModal';
// import { useNavigate } from 'react-router-dom';
// import { isAxiosError } from 'axios';
import { signUp } from '../services/authService';
// import { mockSignUp as signUp } from '../services/mockAutService';
import { ShieldUser, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';

// interface ISignUpStateForm {
//   nickname: string;
//   email: string;
// }

// interface INewUser {
//   nickname: string;
//   code: string;
// }

const formSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(20, 'Nickname too long'),
  email: z.email().min(1, 'Email is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUp(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    // reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: 'failed',
      email: 'vargklee@hotmail.com',
    },
  });

  // const [formData, setFormData] = useState<ISignUpStateForm>({
  //   nickname: 'test',
  //   email: 'test@test.com',
  // });
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isNicknameError, setIsNicknameError] = useState<boolean>(false);
  // const [isEmailError, setIsEmailError] = useState<boolean>(false);
  // const [showModal, setShowModal] = useState<boolean>(false);
  // const [newUserData, setNewUserData] = useState<INewUser | null>(null);
  // const navigate = useNavigate();

  // const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const onFormSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      console.table(data);

      const res = await signUp(data);
      console.log(res);
    } catch (error) {
      console.error(error);
    }

    // setIsLoading(true);
    // setIsNicknameError(false);
    // setIsEmailError(false);

    // if (!isValidEmail(formData.email)) {
    //   setIsEmailError(true);
    //   setIsLoading(false);
    //   return;
    // }

    // try {
    //   // const { user, code } = await signUp1(formData);
    //   // if (code && user) {
    //   //   // setShowModal(true);
    //   //   // setNewUserData({
    //   //   //   nickname: user.nickname,
    //   //   //   code: code,
    //   //   // });
    //   // } else {
    //   //   throw new Error('Something went wrong!!');
    //   // }
    // } catch {
    //   // Use unknown instead of any
    //   // Check if it's an AxiosError
    //   // if (err instanceof AxiosError) {
    //   //   const res = err.response;
    //   //   console.error('error ===>', res);
    //   //   const errMsg = res?.data?.message || err.message;
    //   //   toast.error(errMsg, {
    //   //     style: {
    //   //       borderRadius: '10px',
    //   //       background: '#333',
    //   //       color: '#fff',
    //   //     },
    //   //   });
    //   //   if (res) {
    //   //     const { status, data } = res;
    //   //     const message = (data.message || '').toLowerCase();
    //   //     if (status === 409) {
    //   //       if (message.includes('email')) {
    //   //         setIsEmailError(true);
    //   //       } else if (message.includes('nickname')) {
    //   //         setIsNicknameError(true);
    //   //       }
    //   //     }
    //   // }
    //   // } else if (err instanceof Error) {
    //   //   // Handle non-Axios errors
    //   //   toast.error(err.message, {
    //   //     style: {
    //   //       borderRadius: '10px',
    //   //       background: '#333',
    //   //       color: '#fff',
    //   //     },
    //   //   });
    //   // } else {
    //   //   // Handle unknown error types
    //   //   toast.error('An unknown error occurred', {
    //   //     style: {
    //   //       borderRadius: '10px',
    //   //       background: '#333',
    //   //       color: '#fff',
    //   //     },
    //   //   });
    //   // }
    // } finally {
    //   // setIsLoading(false);
    // }
  };

  // const onModalClose = () => {
  //   setShowModal(false);
  //   void navigate('/signin');
  // };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <form className="form-base" onSubmit={handleSubmit(onFormSubmit)}>
        <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>

        <fieldset className="my-2">
          <label className="label font-bold">Nickname</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <ShieldUser />
            </div>
            <input
              type="text"
              {...register('nickname')}
              className={clsx('input-base', {
                'border-red-400': errors.nickname,
              })}
              placeholder="Nickname"
            />
          </div>
          {errors.nickname && (
            <p className="text-red-400 text-center">
              {errors.nickname.message}
            </p>
          )}
        </fieldset>

        <fieldset className="my-2">
          <label className="label font-bold">Email</label>

          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Mail />
            </div>

            <input
              type="email"
              {...register('email')}
              className={clsx('input-base', {
                'border-red-400': errors.email,
              })}
              placeholder="Email"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-center">{errors.email.message}</p>
          )}
        </fieldset>

        <button
          type="submit"
          className="button-base mt-4"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
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
      </form>

      {/* {newUserData && showModal && (
        <CodeModal
          nickname={newUserData.nickname}
          code={newUserData.code}
          isOpen={showModal}
          onClose={onModalClose}
        />
      )} */}
    </div>
  );
}
