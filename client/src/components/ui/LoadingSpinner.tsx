import type { JSX } from "react";

export function LoadingSpinner(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen text-xl">
      <span className="loading loading-infinity loading-xl text-[#FF2E63]"></span>
      Getting Ready
    </div>
  );
}
