import toast from 'react-hot-toast';

export const onGlobalError = (msg: string): void => {
  toast.error(msg);
};
