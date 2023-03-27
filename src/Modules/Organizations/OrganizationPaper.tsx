import styled from "styled-components";
import { api } from "../../utils/api";

interface OrganizationPaperProps {
  organizationId: string;
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
}) => {

  const { data: organization } = api.organizations.getOrganizationWithPunishmentData.useQuery({
    organizationId,
    approved: true,
    redeemed: false,
  });

  return (
    <Card>
      <p>{organization?.data?.organization?.name}</p>
      <p>{`Total Punishments: ${organization?.data?.organization?.punishments.reduce((acc, punishment) => acc + (punishment.approved ? punishment.quantity : 0), 0 ) ?? ""}`}</p>
    </Card>
  );
};
export default OrganizationPaper;
