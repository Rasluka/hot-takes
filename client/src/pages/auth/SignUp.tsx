import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import clsx from 'clsx';
import { ShieldUser, Mail } from 'lucide-react';
import { useState, type JSX } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { CodeModal } from '@/components/ui/CodeModal';
import { signUp } from '@/services/authService';
import type { UserSignUpType } from '@/types/user';
import { onGlobalError } from '@/utils/global-error';

const formSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(20, 'Nickname too long'),
  email: z.email().min(1, 'Email is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUp(): JSX.Element {
  const [signUpResult, setSignUpResult] = useState<UserSignUpType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });
  const navigate = useNavigate();

  const onFormSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const res = await signUp(data);
      console.log(res);
      setSignUpResult(res);
      setIsModalOpen(true);
    } catch (err) {
      if (isAxiosError(err) && err.message) {
        const errorMsg = err.message;

        onGlobalError(errorMsg);

        if (errorMsg.toLowerCase().includes('email')) {
          setError('email', {
            type: 'manual',
            message: errorMsg,
          });
        } else if (errorMsg.toLowerCase().includes('nickname')) {
          setError('nickname', {
            type: 'manual',
            message: errorMsg,
          });
        }
      } else {
        onGlobalError('Something went wrong!');
      }
    }
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setSignUpResult(null);
    void navigate('/signin', { replace: true });
  };

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

      {signUpResult && isModalOpen && (
        <CodeModal
          nickname={signUpResult.user.nickname}
          code={signUpResult.code}
          isOpen={isModalOpen}
          onClose={onModalClose}
        />
      )}
    </div>
  );
}
