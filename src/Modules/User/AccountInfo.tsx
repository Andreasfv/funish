import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { z } from "zod";
import FormButton from "../../components/input/formButton";
import FormInput from "../../components/input/formInput";
import SwitchInput from "../../components/input/switchInput";
import { api } from "../../utils/api";
import FormField from "../Punishment/components/FormField";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 1rem;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 1rem;
  align-items: center;
  border-radius: 0.5rem;
  gap: 1rem;

  background-color: ${(props) => props.theme.colors.lightGreen};
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  box-shadow: ${(props) => props.theme.shadow.wrapperShadow};
`;

const AccountContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 700px;
  padding: 1rem;
  border-radius: 0.5rem;
  gap: 1rem;

  background-color: ${(props) => props.theme.colors.green};
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-size: 1.5rem;
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  align-items: center;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
`;
const FormFieldRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 1rem;
  @media ${(props) => props.theme.media.largeMobile} {
    flex-direction: column;
  }
`;
const FormText = styled.div`
  display: flex;
  align-items: center;
  height: 43.64px;
  border-radius: 4px;
  border: 2px solid white;
  border-top: 3px solid white;
  outline: 2px white;
`;
const UserFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const InviteLink = styled.div`
  :hover {
    cursor: pointer;
  }
`;

type UserFormType = z.infer<typeof UserFormSchema>;

interface AccountInfoProps {
  user: Omit<User, "createdAt" | "emailVerified" | "updatedAt">;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ user }) => {
  const [edit, setEdit] = useState(false);
  const { mutate: updateUser } = api.users.updateUser.useMutation({
    onSuccess: () => {
      toast("Data saved", {
        type: "success",
        position: "bottom-center",
      });
      user.name = getValues("name");
      user.email = getValues("email");
      setEdit(false);
    },
    onError: (err) => {
      toast(err.message, {
        type: "error",
        position: "bottom-center",
      });
    },
  });

  function handleSetEdit() {
    setEdit(!edit);
  }

  const { handleSubmit, register, getValues } = useForm<UserFormType>({
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
    },
    resolver: zodResolver(UserFormSchema),
  });
  function handleUpdateUser() {
    handleSubmit((data) => {
      const submitData = {
        id: user.id,
        ...data,
      };
      updateUser(submitData);
    })().catch((err: Error) => {
      toast(err.message, {
        type: "error",
        position: "bottom-center",
      });
    });
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <AccountContentWrapper>
          <TitleWrapper>
            <h1>Account Info</h1>
            <SwitchContainer>
              <label>Edit: </label>
              <SwitchInput value={edit} onClick={handleSetEdit} />
            </SwitchContainer>
          </TitleWrapper>
          <FormWrapper>
            <FormFieldRow>
              <FormField>
                <label>Name</label>
                {edit ? (
                  <FormInput register={register("name")} />
                ) : (
                  <FormText>{user.name} </FormText>
                )}
              </FormField>
              <FormField>
                <label>Email</label>
                {edit && false ? ( // Email editing is disabled for now
                  <FormInput register={register("email")} />
                ) : (
                  <FormText>{user.email} </FormText>
                )}
              </FormField>
            </FormFieldRow>
            <FormFieldRow>
              <FormField>
                <label>Profile Picture</label>
                <Image
                  src={user.image ?? ""}
                  width={200}
                  height={200}
                  alt="No profile pic ;("
                />
              </FormField>
            </FormFieldRow>
            {edit && (
              <FormField>
                <FormButton onClick={handleUpdateUser}>Save</FormButton>
              </FormField>
            )}
          </FormWrapper>
        </AccountContentWrapper>
        <AccountContentWrapper>
          <FormWrapper>
            <FormField
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `${window.location.host}/&?organizationId=${
                      user?.organizationId ?? ""
                    }`
                  )
                  .then(() => {
                    toast("Copied to clipboard", {
                      type: "success",
                      position: "bottom-center",
                    });
                  })
                  .catch(() => {
                    toast("Failed to copy to clipboard", {
                      type: "error",
                      position: "bottom-center",
                    });
                  });
              }}
            >
              <label>Invite Link:{" (click to copy)"}</label>
              <InviteLink>{`${window.location.host}/&?organizationId=${
                user?.organizationId ?? ""
              }`}</InviteLink>
            </FormField>
          </FormWrapper>
        </AccountContentWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default AccountInfo;
