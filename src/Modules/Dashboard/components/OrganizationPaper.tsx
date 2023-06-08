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

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
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

  const SPCount =
    organization?.data?.organization?.punishments.reduce(
      (acc, punishment) =>
        acc + (punishment.approved ? punishment.quantity : 0),
      0
    ) ?? 0;

  return (
    <Card onClick={onClick}>
      <Title>
        <p>{organization?.data?.organization?.name}</p>
      </Title>
      <ContentRow>
        <p>{`Total SP: ${SPCount}`}</p>
      </ContentRow>
      <ContentRow>
        <p>{`Liter øl: ${Math.round(SPCount * 0.33)}`}</p>
      </ContentRow>
      <SPKingWrapper>
        {spKingDataLoading ? (
          <Spinner />
        ) : (
          <SPKingContent>
            <span>Kongen av SP: </span>
            <>
              {!!spKingData?.spKing?.image &&
              spKingData?.spKing?.image !== "" ? (
                <ProfileIcon
                  src={spKingData?.spKing?.image ?? ""}
                  width={50}
                  height={50}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();

                    void router.push(
                      `/${organizationId}/user-punishments/${
                        spKingData?.spKing?.id ?? ""
                      }`
                    );
                  }}
                />
              ) : (
                "Ingen Konge - Tapere!"
              )}
            </>
          </SPKingContent>
        )}
      </SPKingWrapper>
    </Card>
  );
};

export default OrganizationPaper;
