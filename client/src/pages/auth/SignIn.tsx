import { AxiosError } from 'axios';
import { ShieldUser, UserLock } from 'lucide-react';
import type { JSX } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

import { useUser } from '@/contexts/UserContext';
import { login } from '@/services/authService';
import type { UserType } from '@/types/user';
import { onGlobalError } from '@/utils/global-error';
import z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

const formSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(20, 'Nickname too long'),
  code: z
    .string()
    .min(8, 'Code should 8 characters')
    .max(8, 'Code should 8 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function SignIn(): JSX.Element {
  const userContext = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const onFormSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const user: UserType = await login(data);
      userContext.login(user);
      toast.success('Logged in successfully!');
      void navigate('/');
    } catch (err) {
      console.error(err);
      let errorMsg: string = 'Something went wrong.';

      if (err instanceof AxiosError && err.response) {
        const responseData = err.response.data as { message?: string };
        if (responseData.message) {
          errorMsg = responseData.message;
        }
      }

      onGlobalError(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <form className="form-base" onSubmit={handleSubmit(onFormSubmit)}>
        <h1 className="text-2xl font-bold text-center mb-2">Welcome</h1>

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
          <label className="label font-bold">Password</label>

          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <UserLock />
            </div>
            <input
              type="password"
              {...register('code')}
              className={clsx('input-base', {
                'border-red-400': errors.code,
              })}
              placeholder="Code"
            />
          </div>
          {errors.code && (
            <p className="text-red-400 text-center">{errors.code.message}</p>
          )}
        </fieldset>

        <button
          type="submit"
          className="button-base mt-4"
          disabled={!isValid || isSubmitting}
        >
          Login
        </button>

        <div className="divider divider-neutral dark:divider-primary">OR</div>

        <Link to="/signup" className="link link-hover text-center font-bold">
          Create New Account
        </Link>
      </form>
    </div>
  );
}
