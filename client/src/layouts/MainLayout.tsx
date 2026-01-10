import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { MainNavBar } from '@/components/layout/Navbar';

export function MainLayout(): JSX.Element {
  return (
    <div className="bg-base-200">
      <MainNavBar />
      <main className="grow container mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
