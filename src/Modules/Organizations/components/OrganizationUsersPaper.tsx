import { User } from "@prisma/client";
import Image from "next/image";
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
}

const OrganizationUsersPaper: React.FC<OrganizationUsersPaper> = ({
  users,
  isLoading,
}) => {
  return (
    <PaperWrapper>
      {!isLoading && users.map((user, i) => <UserPaper user={user} key={i} />)}
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
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
`;
interface UserPaperProps {
  user: User;
}
const UserPaper: React.FC<UserPaperProps> = ({ user }) => {
  return (
    <UserPaperWrapper>
      <UserImage width={16} height={16} src={user.image ?? ""} alt=":)" />
      <div>{user.name}</div>
    </UserPaperWrapper>
  );
};
