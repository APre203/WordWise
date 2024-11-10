"use client";
// Look how to set up authentication with kinde
import {KindeProvider} from "@kinde-oss/kinde-auth-nextjs";

export const AuthProvider = (
    {children}: Readonly<{
    children: React.ReactNode;
  }>) => {
  return <KindeProvider>{children}</KindeProvider>;
};