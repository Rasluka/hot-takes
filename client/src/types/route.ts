import type { JSX } from 'react';

export interface AppRoute {
  path: string;
  element?: JSX.Element;
  layout?: React.ComponentType;
  protected?: boolean;
  children?: AppRoute[];
}
