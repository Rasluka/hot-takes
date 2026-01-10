import type { ReactNode } from 'react';
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { useUser } from '@/contexts/UserContext';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps): JSX.Element {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
