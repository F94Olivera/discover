export type User = {
  id: string;
  name: string;
  email: string;
  passwordVerifier: string;
  passwordSalt: string;
};
export type Session = { userId: string };
export type SignupInput = { name: string; email: string; password: string; confirmation: string };
export type SignupErrors = Partial<Record<keyof SignupInput, string>>;
export type SignupResult =
  | { status: 'success'; user: User; session: Session }
  | { status: 'invalid'; errors: SignupErrors }
  | { status: 'error' | 'account-saved'; message: string };

export type SigninInput = { email: string; password: string };
export type SigninErrors = Partial<Record<keyof SigninInput, string>>;
export type SigninResult =
  | { status: 'success'; user: User; session: Session }
  | { status: 'invalid'; errors: SigninErrors }
  | { status: 'error'; message: string };
export type SignoutResult = { status: 'success' } | { status: 'error'; message: string };
