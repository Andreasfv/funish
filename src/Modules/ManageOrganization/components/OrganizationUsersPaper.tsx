import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import styled from "styled-components";
import Spinner from "../../../components/Spiner";
import { api } from "../../../utils/api";

const PaperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
  background-color: white;
  gap: 0.4rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
`;

interface OrganizationUsersPaper {
  users: User[];
  isLoading: boolean;
  refetch: () => void;
}

const OrganizationUsersPaper: React.FC<OrganizationUsersPaper> = ({
  users,
  isLoading,
  refetch,
}) => {
  return (
    <PaperWrapper>
      {!isLoading &&
        users.map((user, i) => (
          <UserPaper refetch={refetch} user={user} key={i} />
        ))}
      {isLoading && <Spinner />}
    </PaperWrapper>
  );
};

export default OrganizationUsersPaper;

const UserPaperWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 3rem;
  background-color: ${(props) => props.theme.colors.lightGreen};
  padding: 0.5rem;
  gap: 0.5rem;
  align-items: center;
  border-radius: 0.5rem;
`;

const UserImage = styled(Image)`
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
`;

const ActionButton = styled.button`
  margin-left: auto;
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  height: 100%;
  background-color: ${(props) => props.theme.colors.lightGreen};
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  &:hover {
    background-color: ${(props) => props.theme.colors.lightDarkGreen};
  }
`;
interface UserPaperProps {
  user: User;
  refetch: () => void;
}
const UserPaper: React.FC<UserPaperProps> = ({ user, refetch }) => {
  const userIsAdmin = user.role === "ORG_ADMIN" || user.role === "SUPER_ADMIN";
  const session = useSession();
  const router = useRouter();
  const { organizationId } = router.query;
  const { mutate: transferAdmin } =
    api.organizations.transferAdminStatus.useMutation({
      onSuccess: () => {
        toast("Admin rettigheter overført", { type: "success" });
        void refetch();
      },
      onError: () => {
        toast("Noe gikk galt", { type: "error" });
      },
    });

  function transferAdminStatus() {
    const confirmed = confirm(
      "Er du sikker på at du vil overføre admin rettighetene dine til denne brukeren?"
    );
    if (confirmed) {
      transferAdmin({
        organizationId: organizationId as string,
        fromUserId: session.data?.user.id ?? "",
        targetUserId: user.id,
      });
    }
  }
  return (
    <UserPaperWrapper>
      <UserImage
        width={16}
        height={16}
        src={user.image ?? ""}
        alt=":)"
        unoptimized
      />
      <div>{user.name}</div>
      {session?.data?.user.role === "SUPER_ADMIN" && !userIsAdmin && (
        <ActionButton onClick={transferAdminStatus}>
          {session?.data?.user.role === "SUPER_ADMIN"
            ? "Gi admin tilgang"
            : "Overfør admin rettigheter"}
        </ActionButton>
      )}
    </UserPaperWrapper>
  );
};
