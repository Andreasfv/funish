import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { BasePageLayout } from "../BasePageLayout.tsx/view/BasePageLayout";
import OrganizationPaper from "../Organizations/components/OrganizationPaper";
import PunishmentCard from "../Punishment/components/PunishmentCard";
import { api } from "../../utils/api";
import Link from "next/link";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
  height: 100%;
  gap: 1rem;
`;

const InnerWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;

  @media ${(props) => props.theme.media.largeMobile} {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 1rem;
  flex-grow: 1;
  justify-content: flex-start;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  background-color: ${(props) => props.theme.colors.lightGreen};
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
`;

const LogWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 200px;
  gap: 1rem;
  justify-content: flex-start;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  background-color: ${(props) => props.theme.colors.lightGreen};
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);

  @media ${(props) => props.theme.media.largeMobile} {
    width: 100%;
  }
`;

const BigButton = styled(Link)`
  display: flex;
  height: 3rem;
  background-color: ${(props) => props.theme.colors.green};
  width: 100%;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  padding: 0.5rem;

  align-items: center;
  justify-content: center;
  text-decoration: none;

  :hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;
const Dashboard: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  console.log(session.data);
  const { organizationId } = router.query;
  const { data: userData, isLoading: userDataLoading } =
    api.users.getComprehensiveUserData.useQuery({
      userId: session.status == "authenticated" ? session?.data?.user?.id : "",
      where: {
        approved: true,
        redeemed: false,
      },
    });

  if (userDataLoading) {
    return <BasePageLayout>Loading...</BasePageLayout>;
  }

  if (userData?.data?.user?.organization) {
    const { organization } = userData.data.user;
    return (
      <BasePageLayout>
        <Wrapper>
          <ContentWrapper>
            <InnerWrapper>
              <ContentWrapper>
                <CardsWrapper>
                  <BigButton href={`/${organization.id}/punishment/punish`}>
                    PUNISH!!
                  </BigButton>
                </CardsWrapper>
                <CardsWrapper>
                  {userData.data?.user?.organizationId &&
                    userData?.data?.user?.organization?.punishmentTypes?.map(
                      (punishmentType, index) => (
                        <PunishmentCard
                          key={index}
                          punishmentType={punishmentType.name}
                          count={punishmentType.Punishments.reduce(
                            (acc, punishment) =>
                              acc +
                              (punishment.approved ? punishment.quantity : 0),
                            0
                          )}
                        />
                      )
                    )}
                </CardsWrapper>
                {userData.data?.user?.organizationId && (
                  <CardsWrapper>
                    <OrganizationPaper
                      organizationId={(organizationId as string) ?? ""}
                    />
                  </CardsWrapper>
                )}
              </ContentWrapper>
              <LogWrapper>###Event Log###</LogWrapper>
            </InnerWrapper>
          </ContentWrapper>
        </Wrapper>
      </BasePageLayout>
    );
  }

  return <BasePageLayout>Whoopsie, something went wrong</BasePageLayout>;
};

export default Dashboard;
