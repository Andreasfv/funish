import { api } from "../api";

export const useAdmin = () => {
  const { data } = api.users.me.useQuery();
  const admin =
    data?.data.user?.role === "SUPER_ADMIN" ||
    data?.data.user?.role === "ORG_ADMIN";
  return admin;
};
