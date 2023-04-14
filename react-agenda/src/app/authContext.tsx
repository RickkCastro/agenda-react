import { createContext, useContext } from 'react';
import { IUser } from './backend';

export interface IAuthContext {
  user: IUser;
  onSingOut: () => void;
}

export const authContext = createContext<IAuthContext>({
  user: { name: '', email: '' },
  onSingOut: () => {},
});

export function useAuthContext() {
  return useContext(authContext);
}
