import { useRouter } from "next/router";
import styled from "styled-components";
import { api } from "../../../../utils/api";
import { BasePageLayout } from "../../../BasePageLayout.tsx/BasePageLayout";
import PunishmentRow from "../../components/PunishmentRow";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.lightGreen};
  padding: 1rem;
  gap: 1rem;
`;

const PunishmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 0.5rem;
  background-color: white;

  padding: 1rem;
  gap: 1rem;
`;

const PunishmentTypeWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.lightGreen};
  padding: 0 1rem 1rem 1rem;
  gap: 0.2rem;

  height: 400px;
  overflow-y: scroll;

  & > :first-child {
    position: sticky;
    display: flex;
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.lightGreen};
    padding: 0.5rem;
    top: 0;
    div {
      flex: 1;
    }
  }

  & > :nth-child(2) {
  }
`;

const TitleBar = styled.div`
  display: flex;
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  align-content: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.lightDarkGreen};
  font-weight: 600;
  font-size: 1.5rem;
`;

const MyPunishments: React.FC = () => {
  const router = useRouter();
  const { organizationId } = router.query;
  const { data: me } = api.users.me.useQuery();
  const { data: punishments } =
    api.punishmentTypes.getPunishmentTypesWithPunishmentsForUser.useQuery(
      {
        userId: me?.data?.user?.id ?? "",
        organizationId: (organizationId as string) ?? "",
        redeemed: false,
        approved: true,
      },
      {
        enabled: !!organizationId && !!me?.data?.user?.id,
      }
    );

    return (
    <BasePageLayout>
      <Wrapper>
        <ContentWrapper>
          <TitleBar>My Punishments</TitleBar>
          <PunishmentWrapper>
            {punishments?.data?.punishmentTypes.map((punishmentType) => (
              <PunishmentTypeWrapper key={punishmentType.id}>
                <div>
                  <div>{punishmentType.name}</div>
                  <div>
                    Totalt:{" "}
                    {punishmentType.Punishments.reduce(
                      (acc, cur) => acc + (cur.approved ? cur.quantity : 0),
                      0
                    )}
                  </div>
                  <div>{punishmentType.description}</div>
                  <div></div>
                </div>
                {punishmentType.Punishments.map((punishment) => (
                  <PunishmentRow key={punishment.id} punishment={punishment} />
                ))}
              </PunishmentTypeWrapper>
            ))}
          </PunishmentWrapper>
        </ContentWrapper>
      </Wrapper>
    </BasePageLayout>
  );
};

export default MyPunishments;
