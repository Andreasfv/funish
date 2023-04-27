import styled from "styled-components";
import { api } from "../../../utils/api";

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

  ${(props) =>
    props.onClick &&
    `
      cursor: pointer;
      :hover {
        border: 1px solid ${props.theme.colors.blue}
      }
    `}
`;

interface OrganizationPaperProps {
  organizationId: string;
  onClick?: () => void;
}

const OrganizationPaper: React.FC<OrganizationPaperProps> = ({
  organizationId,
  onClick,
}) => {
  const { data: organization } =
    api.organizations.getOrganizationWithPunishmentData.useQuery({
      organizationId,
      approved: true,
      redeemed: false,
    });

  return (
    <Card onClick={onClick}>
      <p>{organization?.data?.organization?.name}</p>
      <p>{`Total SP: ${
        organization?.data?.organization?.punishments.reduce(
          (acc, punishment) =>
            acc + (punishment.approved ? punishment.quantity : 0),
          0
        ) ?? ""
      }`}</p>
    </Card>
  );
};
export default OrganizationPaper;
