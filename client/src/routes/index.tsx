import { MainLayout } from '@/layouts/MainLayout';
import { MinimalLayout } from '@/layouts/MinimalLayout';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import AboutUs from '@/pages/public/AboutUs';
import Home from '@/pages/public/Home';
import { GuestRoute } from '@/routes/GuestRoute';
import type { AppRoute } from '@/types/route';

export const routes: AppRoute[] = [
  {
    path: '/',
    layout: MainLayout,
    children: [
      { path: '/', element: <Home /> },
      { path: '/aboutus', element: <AboutUs /> },
    ],
  },
  {
    path: '/',
    layout: MinimalLayout,
    children: [
      {
        path: '/signin',
        element: (
          <GuestRoute>
            <SignIn />
          </GuestRoute>
        ),
      },
      {
        path: '/signup',
        element: (
          <GuestRoute>
            <SignUp />
          </GuestRoute>
        ),
      },
    ],
  },
  //Standalone routes
];
