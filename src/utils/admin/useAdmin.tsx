import { useSession } from "next-auth/react";

export const useAdmin = () => {
  const { data } = useSession();
  const admin =
    data?.user?.role === "SUPER_ADMIN" || data?.user?.role === "ORG_ADMIN";
  return admin;
};
