import { useRouter } from "next/router";
import styled from "styled-components";
import { ProfileIcon } from "../../../components/ProfileIcon";
import Spinner from "../../../components/Spiner";
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

const SPKingWrapper = styled.div`
  display: flex;
  margin-top: auto;
  flex-direction: column;
`;

const SPKingContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  span {
    margin-right: 0.5rem;
  }
  img {
    margin-left: auto;
  }
`;
interface OrganizationPaperProps {
  organizationId: string;
  onClick?: () => void;
}

const OrganizationPaper: React.FC<OrganizationPaperProps> = ({
  organizationId,
  onClick,
}) => {
  const router = useRouter();
  const { data: organization } =
    api.organizations.getOrganizationWithPunishmentData.useQuery({
      organizationId,
      approved: true,
      redeemed: false,
    });

  const { data: spKingData, isLoading: spKingDataLoading } =
    api.organizations.getOrganizationSPKing.useQuery(organizationId);
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

      <SPKingWrapper>
        {spKingDataLoading ? (
          <Spinner />
        ) : (
          <SPKingContent>
            <span>Kongen av SP: </span>
            <>
              <ProfileIcon
                src={spKingData?.spKing?.image ?? ""}
                width={50}
                height={50}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();

                  void router.push(
                    `/${organizationId}/user-punishments/${
                      spKingData?.spKing?.id ?? ""
                    }`
                  );
                }}
              />
            </>
          </SPKingContent>
        )}
      </SPKingWrapper>
    </Card>
  );
};

export default OrganizationPaper;
