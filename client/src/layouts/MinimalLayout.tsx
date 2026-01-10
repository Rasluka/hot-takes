import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

import { MinimalNavbar } from '@/components/layout/MinimalNavbar';

export function MinimalLayout(): JSX.Element {
  return (
    <div className="bg-base-200">
      <MinimalNavbar />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
