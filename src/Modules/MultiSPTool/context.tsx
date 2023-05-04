import { createContext, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../../utils/admin/useAdmin";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import type { CreateMultipleSPUserEntry, SPInput } from "./types";
type handleSPChangeInput<T> = {
  userId: string;
  spIndex: number;
  field: keyof T & string;
};
interface MultiSPContextType {
  users: RouterOutputs["users"]["getOrganizationUsers"]["data"]["users"];
  usersSP: CreateMultipleSPUserEntry[];
  organizationId: string;
  errors: string[];
  handleResetSP: () => void;
  handleSetOrganization: (orgId: string) => void;
  handleSetUsers: (users: MultiSPContextType["users"]) => void;
  handleAddUser: (userId: string) => void;
  handleRemoveUser: (userId: string) => () => void;
  handleAddSP: (userId: string, fromId: string) => () => void;
  handleRemoveSP: (userId: string, spIndex: number) => () => void;
  handleSPChange: (
    input: handleSPChangeInput<SPInput>
  ) => (value: SPInput[keyof SPInput]) => void;
  submitState: string;
  handleSubmit: () => void;
}

export const MultiSPContext = createContext<MultiSPContextType>({
  users: [],
  usersSP: [],
  organizationId: "",
  errors: [],
  handleResetSP: () => null,
  handleSetOrganization: () => null,
  handleSetUsers: () => null,
  handleAddUser: () => null,
  handleRemoveUser: () => () => null,
  handleAddSP: () => () => null,
  handleRemoveSP: () => () => null,
  handleSPChange: () => () => null,
  submitState: "",
  handleSubmit: () => null,
});

const MultiSPProvider = ({ children }: { children: JSX.Element }) => {
  const [users, setUsers] = useState<MultiSPContextType["users"]>([]);
  const [usersSP, setUsersSP] = useState<MultiSPContextType["usersSP"]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState("");

  const isAdmin = useAdmin();

  const handleSetOrganization = useCallback((orgId: string) => {
    setOrganizationId(orgId);
  }, []);

  const { mutate: createMultipleSP } =
    api.punishments.createManyPunishments.useMutation();

  const handleSetUsers = useCallback(
    (users: MultiSPContextType["users"]) => {
      setUsers(users);
    },
    [setUsers]
  );

  const handleResetSP = useCallback(() => {
    setUsersSP([]);
  }, []);

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
          organizationId: organizationId,
          typeId: "",
          reasonId: "",
          quantity: 1,
          description: "",
          proof:
            "https://cdn3.whatculture.com/images/2020/06/53eb42242abaacfa-600x338.jpg",
          approved: isAdmin,
        };

        userSPEntry.sp.push(newSP);
        usersSP[userSPIndex] = userSPEntry;
        setUsersSP([...usersSP]);
      };
    },
    [isAdmin, organizationId, usersSP]
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
    (
      input: handleSPChangeInput<SPInput>
    ): ((value: SPInput[keyof SPInput]) => void) => {
      return (value: SPInput[keyof SPInput]) => {
        const { userId, spIndex, field } = input;
        const userSPEntry = usersSP.find((user) => user.id === userId);

        if (!userSPEntry) return;
        const userSPIndex = usersSP.findIndex((user) => user.id === userId);
        const spToUpdate = userSPEntry.sp[spIndex];

        if (!spToUpdate) return;

        // I couldn't figure out the typescript for this. I probably have to remake the function to do so.
        field;
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

  const verifySubmitSPArray = useCallback(() => {
    const errors: string[] = [];
    if (usersSP.length === 0) {
      errors.push("Du må legge til minst en bruker med minst en SP");
    }
    for (const user of usersSP) {
      if (user.sp.length === 0) {
        errors.push(`${user.name} har ingen SP lagt til`);
        continue;
      }
      for (const sp of user.sp) {
        if (sp.reasonId === "") {
          errors.push(
            ` Du må velge begrunnelse for en eller flere SP for ${user.name} `
          );
          break;
        }

        if (sp.typeId === "") {
          errors.push(
            ` Du må velge type for en eller flere SP for ${user.name} `
          );
          break;
        }

        if (
          sp.createdById === "" ||
          sp.userId === "" ||
          sp.organizationId == ""
        ) {
          errors.push(
            `Noe som ikke er din feil gikk galt, send melding til Andreas hvis det vedvarer, gjerne med screenshot :))`
          );
        }
      }
    }
    setErrors(errors);
    return errors.length === 0 ? true : false;
  }, [usersSP]);

  const handleSubmit = useCallback(() => {
    setErrors([]);
    setSubmitState("verifying");
    const spToSubmit = usersSP.map((user) => user.sp).flat();
    const verified = verifySubmitSPArray();
    if (!verified) {
      setSubmitState("");
      return;
    }
    setSubmitState("sending!");
    createMultipleSP(spToSubmit, {
      onSuccess: () => {
        toast("SP lagret!", {
          type: "success",
        });
        setSubmitState("");
        handleResetSP();
      },
      onError: (error) => {
        setErrors([...errors, error.message]);
        setSubmitState("");
        toast("Noe gikk galt", {
          type: "error",
        });
      },
    });
  }, [createMultipleSP, errors, handleResetSP, usersSP, verifySubmitSPArray]);

  return (
    <MultiSPContext.Provider
      value={{
        users,
        usersSP,
        organizationId,
        errors,
        handleSetOrganization,
        handleSetUsers,
        handleResetSP,
        handleAddUser,
        handleRemoveUser,
        handleAddSP,
        handleRemoveSP,
        handleSPChange,
        submitState,
        handleSubmit,
      }}
    >
      {children}
    </MultiSPContext.Provider>
  );
};

export default MultiSPProvider;
