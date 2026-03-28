export interface User {
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  refreshToken: string;

  roles?: string[];
}
