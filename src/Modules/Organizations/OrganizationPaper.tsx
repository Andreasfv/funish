import styled from "styled-components";
import { api } from "../../utils/api";

interface OrganizationPaperProps {
  organizationId: string;
  userId: string;
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  width: 100%;
  height: 200px;
  background-color: white;
  border-radius: 0.7rem;
  padding: 1rem;
  border: ${(props) => props.theme.borders.cardBorder};
  box-shadow: ${(props) => props.theme.shadow.cardShadow};
`;

const OrganizationPaper: React.FC<OrganizationPaperProps> = ({
  organizationId,
  userId,
}) => {
  const { data: punishment } = api.punishments.getPunishments.useQuery({
    organizationId: organizationId,
    userId: userId,
  });
  return (
    <Card>
      <p>Organization</p>
      <p>{`Total Punishments: ${punishment?.punishment.length ?? ""}`}</p>
    </Card>
  );
};
export default OrganizationPaper;
