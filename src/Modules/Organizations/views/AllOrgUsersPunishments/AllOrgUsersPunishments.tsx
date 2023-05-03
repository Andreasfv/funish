import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import Spinner from "../../../../components/Spiner";
import type { RouterInputs } from "../../../../utils/api";
import { api } from "../../../../utils/api";
import { BasePageLayout } from "../../../BasePageLayout.tsx/view/BasePageLayout";
import type { HeaderColumnProps } from "./components/HeaderColumn";
import HeaderRow from "./components/HeaderRow";
import UserPunishmentsRow from "./components/UserPunishmentsRow";
import { sortUsers } from "./util/sortUsers";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  padding: 1rem;

  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const AllOrgUsersPunishments: React.FC = () => {
  const session = useSession();
  const router = useRouter();
  const organizationId = session.data?.user.organizationId;
  const [orderBy, setOrderBy] =
    useState<
      RouterInputs["organizations"]["getOrganizationUsersWithPunishmentData"]["orderBy"]
    >("spCount");

  const { data: organization, isLoading } =
    api.organizations.getOrganizationUsersWithPunishmentData.useQuery(
      {
        organizationId: organizationId ?? "",
        redeemed: false,
        orderBy: orderBy,
      },
      {
        enabled: !!organizationId,
      }
    );

  const goToUserPunishments = useCallback(
    (userId: string) => {
      return () => {
        if (!organizationId || !userId) return;
        router
          .push(
            `/[organizationId]/user-punishments/[userId]`,
            `/${organizationId}/user-punishments/${userId}`
          )
          .catch((err) => console.warn(err));
      };
    },
    [organizationId, router]
  );

  // This whole clusterfuck is because Prisma cant sort on agrigated counts. So I have to manually sort on relations.
  const userRows = useMemo(() => {
    const users =
      (orderBy === "-unapprovedSPCount" || orderBy === "unapprovedSPCount") &&
      organization?.organization?.users
        ? sortUsers(
            organization?.organization,
            orderBy === "-unapprovedSPCount" ? "desc" : "asc"
          )
        : organization?.organization?.users;

    const rows = users?.map((user, index) => {
      return (
        <UserPunishmentsRow
          key={index}
          user={user}
          onClick={goToUserPunishments(user.id)}
        />
      );
    });
    return rows;
  }, [goToUserPunishments, orderBy, organization?.organization]);

  function handleOrderBy(
    order: RouterInputs["organizations"]["getOrganizationUsersWithPunishmentData"]["orderBy"]
  ) {
    return () => {
      setOrderBy(order);
    };
  }

  const columns: Omit<HeaderColumnProps, "sortBy">[] = [
    {
      label: "Navn",
      setSortBy: handleOrderBy(orderBy === "-name" ? "name" : "-name"),
    },
    {
      label: "SP",
      setSortBy: handleOrderBy(orderBy === "-spCount" ? "spCount" : "-spCount"),
    },
    {
      label: "SP??",
      setSortBy: handleOrderBy(
        orderBy === "-unapprovedSPCount"
          ? "unapprovedSPCount"
          : "-unapprovedSPCount"
      ),
    },
  ];
  return (
    <BasePageLayout>
      <Wrapper>
        <ContentWrapper>
          <HeaderRow columns={columns} orderBy={orderBy} />
          {isLoading && (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          )}
          {userRows}
        </ContentWrapper>
      </Wrapper>
    </BasePageLayout>
  );
};

export default AllOrgUsersPunishments;
