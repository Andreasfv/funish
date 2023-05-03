import { createContext, useCallback, useState } from "react";
import type { RouterOutputs } from "../../utils/api";
import type { CreateMultipleSPUserEntry, SPInput } from "./types";
type handleSPChangeInput<T> = {
  userId: string;
  spIndex: number;
  field: keyof T;
};
interface MultiSPContextType {
  users: RouterOutputs["users"]["getOrganizationUsers"]["data"]["users"];
  usersSP: CreateMultipleSPUserEntry[];
  handleSetUsers: (users: MultiSPContextType["users"]) => void;
  handleAddUser: (userId: string) => void;
  handleRemoveUser: (userId: string) => () => void;
  handleAddSP: (userId: string, fromId: string) => () => void;
  handleRemoveSP: (userId: string, spIndex: number) => () => void;
  handleSPChange: (
    input: handleSPChangeInput<SPInput>
  ) => (value: string | number | boolean) => void;
}

export const MultiSPContext = createContext<MultiSPContextType>({
  users: [],
  usersSP: [],
  handleSetUsers: () => null,
  handleAddUser: () => null,
  handleRemoveUser: () => () => null,
  handleAddSP: () => () => null,
  handleRemoveSP: () => () => null,
  handleSPChange: () => () => null,
});

const MultiSPProvider = ({ children }: { children: JSX.Element }) => {
  const [users, setUsers] = useState<MultiSPContextType["users"]>([]);
  const [usersSP, setUsersSP] = useState<MultiSPContextType["usersSP"]>([]);
  const handleSetUsers = useCallback(
    (users: MultiSPContextType["users"]) => {
      setUsers(users);
    },
    [setUsers]
  );
  const handleAddUser = useCallback(
    (userId: string) => {
      const userName = users?.find((user) => user.id === userId)?.name ?? "";
      const newSP: CreateMultipleSPUserEntry = {
        id: userId,
        name: userName,
        sp: [],
      };

      setUsersSP([...usersSP, newSP]);
    },
    [users, usersSP]
  );

  const handleRemoveUser = useCallback(
    (userId: string) => {
      return () => {
        setUsersSP(usersSP.filter((user) => user.id !== userId));
      };
    },
    [usersSP]
  );

  const handleAddSP = useCallback(
    (userId: string, fromId: string) => {
      return () => {
        const userSPEntry = usersSP.find((user) => user.id === userId);

        if (!userSPEntry) return;

        const userSPIndex = usersSP.findIndex((user) => user.id === userId);

        const newSP = {
          userId: userId,
          createdById: fromId,
          organizationId: "",
          typeId: "",
          reasonId: "",
          quantity: 1,
          description: "",
          proof: "",
          approved: false,
        };

        userSPEntry.sp.push(newSP);
        usersSP[userSPIndex] = userSPEntry;
        setUsersSP([...usersSP]);
      };
    },
    [usersSP]
  );

  const handleRemoveSP = useCallback(
    (userId: string, index: number) => {
      return () => {
        const userSPEntry = usersSP.find((user) => user.id === userId);

        if (!userSPEntry) return;
        const userSPIndex = usersSP.findIndex((user) => user.id === userId);

        userSPEntry.sp.splice(index, 1);
        usersSP[userSPIndex] = userSPEntry;
        setUsersSP([...usersSP]);
      };
    },
    [usersSP]
  );

  const handleSPChange = useCallback(
    (input: handleSPChangeInput<SPInput>) => {
      return (value: string | number | boolean) => {
        const { userId, spIndex, field } = input;
        const userSPEntry = usersSP.find((user) => user.id === userId);

        if (!userSPEntry) return;
        const userSPIndex = usersSP.findIndex((user) => user.id === userId);
        const spToUpdate = userSPEntry.sp[spIndex];

        if (!spToUpdate) return;

        if (
          field === "userId" ||
          field === "createdById" ||
          field === "organizationId" ||
          field === "typeId" ||
          field === "reasonId" ||
          field === "description" ||
          field === "proof"
        ) {
          spToUpdate[field] = value as string;
        }
        if (field === "quantity") {
          spToUpdate[field] = value as number;
        }
        if (field === "approved") {
          spToUpdate[field] = value as boolean;
        }

        userSPEntry.sp[spIndex] = spToUpdate;
        usersSP[userSPIndex] = userSPEntry;
        setUsersSP([...usersSP]);
      };
    },
    [usersSP]
  );

  return (
    <MultiSPContext.Provider
      value={{
        users,
        usersSP,
        handleSetUsers,
        handleAddUser,
        handleRemoveUser,
        handleAddSP,
        handleRemoveSP,
        handleSPChange,
      }}
    >
      {children}
    </MultiSPContext.Provider>
  );
};

export default MultiSPProvider;
