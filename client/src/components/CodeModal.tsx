import type { JSX } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';

interface CodeModalProps {
  nickname: string;
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CodeModal({
  nickname,
  code,
  isOpen,
  onClose,
}: CodeModalProps): JSX.Element | null {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onCodeCopy = useCallback(() => {
    void navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsCopied(true);

    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      timeoutRef.current = null;
    }, 2000);
  }, [code]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box text-center font-bold space-y-4">
        <img
          src="/logo-nobg.png"
          alt="app-logo"
          className="mx-auto mb-4 max-h-24 max-w-full"
        />
        <h1 className="font-bold text-2xl">
          Welcome <span className="text-[#FF2E63]">{nickname}</span>!
        </h1>

        <h2 className="text-lg">Your account has been created successfully.</h2>
        <h2 className="text-lg text-[#FF2E63]">
          Use the code below to log in for the first time:
        </h2>

        <div
          className="w-2/4 mx-auto flex items-center justify-between font-mono text-lg bg-base-200 0 text-[#08D9D6] rounded-md p-2 cursor-pointer select-none hover:bg-gray-200 transition"
          onClick={onCodeCopy}
          title="Click to copy"
        >
          <span className="flex-1 text-center font-mono text-lg">{code}</span>

          {isCopied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>

        <h2 className="text-lg">Please save this code somewhere safe.</h2>

        <div className="modal-action flex justify-center">
          <button className="btn btn-outline btn-secondary" onClick={onClose}>
            Sign In
          </button>
        </div>
      </div>
    </dialog>
  );
}
