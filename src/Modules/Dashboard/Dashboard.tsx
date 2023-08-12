import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { BasePageLayout } from "../BasePageLayout.tsx/view/BasePageLayout";
import OrganizationPaper from "./components/OrganizationPaper";
import PunishmentCard from "./components/PunishmentCard";
import { api } from "../../utils/api";
import Link from "next/link";
import { useMemo } from "react";
import { LatestSPRow } from "./components/LatestSPRow";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
  height: 100%;
  gap: 1rem;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  gap: 1rem;
  flex-grow: 1;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  width: 100%;
  background-color: ${(props) => props.theme.colors.lightGreen};
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);

  @media ${(props) => props.theme.media.largeMobile} {
    flex-direction: row;
  }
`;

const CardContent = styled.div`
  min-width: 200px;

  @media ${(props) => props.theme.media.largeMobile} {
    width: 100%;
  }
`;

const SPWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
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
  const { organizationId } = router.query;
  const { data: userData, isLoading: userDataLoading } =
    api.users.getComprehensiveUserData.useQuery({
      userId: session.status == "authenticated" ? session?.data?.user?.id : "",
      where: {
        approved: true,
        redeemed: false,
      },
    });

  const { data: latestSPData } = api.punishments.getPunishments.useQuery({
    limit: 10,
    organizationId: organizationId as string,
    sort: "createdAt",
    redeemed: false,
    including: {
      user: true,
      createdBy: true,
      type: true,
      reason: true,
    },
  });

  const latestSPRows = useMemo(
    () =>
      latestSPData?.punishment.map((punishment, key) => (
        <LatestSPRow key={key} punishment={punishment} />
      )),
    [latestSPData]
  );
  if (userDataLoading) {
    return <BasePageLayout>Loading...</BasePageLayout>;
  }

  if (userData?.data?.user?.organization) {
    const { organization } = userData.data.user;
    const punishmentCards =
      userData.data?.user?.organizationId &&
      userData?.data?.user?.organization?.punishmentTypes?.map(
        (punishmentType, index) => (
          <CardContent key={index}>
            <PunishmentCard
              onClick={() => {
                void router.push(`/${organization.id}/my-punishments`);
              }}
              key={index}
              punishmentType={punishmentType.name}
              count={punishmentType.Punishments.reduce(
                (acc, punishment) =>
                  acc + (punishment.approved ? punishment.quantity : 0),
                0
              )}
            />
          </CardContent>
        )
      );
    return (
      <BasePageLayout>
        <Wrapper>
          <ContentWrapper>
            <InnerWrapper>
              <BigButton href={`/${organization.id}/punishment/punish`}>
                MELD SP!!
              </BigButton>
              <ContentWrapper>
                <CardsWrapper>
                  {punishmentCards}
                  {userData.data?.user?.organizationId && (
                    <CardContent>
                      <OrganizationPaper
                        onClick={() => {
                          void router.push(
                            `/${organization.id}/all-users-punishments`
                          );
                        }}
                        organizationId={(organizationId as string) ?? ""}
                      />
                    </CardContent>
                  )}
                </CardsWrapper>
              </ContentWrapper>
            </InnerWrapper>
            <CardsWrapper>
              <SPWrapper>
                <p>Siste SP</p>
                {latestSPRows}
              </SPWrapper>
            </CardsWrapper>
          </ContentWrapper>
        </Wrapper>
      </BasePageLayout>
    );
  }

  return <BasePageLayout>Whoopsie, something went wrong</BasePageLayout>;
};

export default Dashboard;
