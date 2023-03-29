import type {
  Punishment,
  PunishmentReason,
  PunishmentType,
} from "@prisma/client";
import type { User } from "next-auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useModal } from "react-hooks-use-modal";
import styled from "styled-components";
import { useAdmin } from "../../../../utils/admin/useAdmin";
import { api } from "../../../../utils/api";
import { useMediaQuery } from "../../../../utils/media/useMedia";
import theme from "../../../../utils/theme";
import { BasePageLayout } from "../../../BasePageLayout.tsx/BasePageLayout";
import PunishmentRow from "../../components/PunishmentRow";
import RedeemPunishmentsModal from "../../components/RedeemPunishmentsModal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  justify-content: center;
  padding: 1rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.lightGreen};
  gap: 0.4rem;
  max-height: 600px;
  border-radius: 0.5rem;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 2.5rem;
  background-color: ${(props) => props.theme.colors.darkGreen};
  padding: 0.5rem;
  border-radius: 0.5rem;
  div {
    display: flex;
    flex: 1;
    align-items: center;
  }
  @media ${(props) => props.theme.media.largeMobile} {
    & > :first-child {
      flex: 2;
    }
  }
  & > :last-child {
    min-width: 175px;
    @media ${theme.media.largeMobile} {
      min-width: 80px;
      max-width: 90px;
    }
  }
`;

const ActionsButton = styled.button`
  display: flex;
  width: 100%;
  color: ${(props) => props.theme.colors.lightDarkGreen};
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;

  :hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

interface UserPunishmentsProps {
  user: User & {
    punishments: (Punishment & {
      type: PunishmentType;
      reason: PunishmentReason;
    })[];
  };
}

const UserPunishments: React.FC<UserPunishmentsProps> = () => {
  const isAdmin = useAdmin();
  const router = useRouter();
  const mobile = useMediaQuery(theme.media.largeMobile);
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
    focusTrapOptions: {
      clickOutsideDeactivates: true,
    },
  });
  const [punishmentRows, setPunishmentRows] = useState<JSX.Element[]>([]);

  const { userId, organizationId } = router.query;
  const {
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
  } = api.punishments.getPunishments.useInfiniteQuery(
    {
      userId: userId as string,
      organizationId: organizationId as string,
      limit: 15,
      redeemed: false,
      including: {
        createdBy: true,
        type: true,
        reason: true,
        user: true,
      },
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  function handleRefetch() {
    void refetch();
  }

  const { mutate: updatePunishmentMutation } =
    api.punishments.updatePunishment.useMutation();
  const { mutate: deletePunishmentMutation } =
    api.punishments.deletePunishment.useMutation();

  const approvePunishment = useCallback(
    (id: string) => {
      return () => {
        updatePunishmentMutation(
          { id: id, approved: true },
          {
            onSuccess: () => {
              void refetch();
            },
          }
        );
      };
    },
    [refetch, updatePunishmentMutation]
  );

  const deletePunishment = useCallback(
    (id: string) => {
      return () => {
        deletePunishmentMutation(id, {
          onSuccess: () => {
            void refetch();
          },
        });
      };
    },
    [deletePunishmentMutation, refetch]
  );

  const createRows = useCallback(() => {
    if (!data) return;
    const punishmentRows = data.pages
      .map((page) => {
        return page.punishment.map((punishment) => {
          return (
            <PunishmentRow
              key={punishment.id}
              punishment={punishment}
              approvePunishment={approvePunishment(punishment.id)}
              deletePunishment={deletePunishment(punishment.id)}
            />
          );
        });
      })
      .flat();
    setPunishmentRows(punishmentRows);
  }, [approvePunishment, data, deletePunishment]);

  function doFetchNextPage() {
    console.log("fetchin!");
    console.log(hasNextPage);
    fetchNextPage()
      .then(() => {
        createRows();
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    createRows();
    return () => {
      setPunishmentRows([]);
    };
  }, [createRows, data]);

  function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    // start fetching when the user gets close to the bottom of the scrollable area
    if (
      e.currentTarget.scrollTop + e.currentTarget.clientHeight >=
      e.currentTarget.scrollHeight - 100
    ) {
      if (isLoading || isFetchingNextPage || !hasNextPage) return;
      doFetchNextPage();
    }
  }

  return (
    <BasePageLayout>
      <Wrapper>
        {isAdmin && (
          <>
            <ContentWrapper>
              <FormWrapper>
                <ActionsButton onClick={open}>Redeem Punishments</ActionsButton>
              </FormWrapper>
            </ContentWrapper>
            <Modal>
              <RedeemPunishmentsModal
                userId={userId as string}
                organizationId={organizationId as string}
                refetch={handleRefetch}
                close={close}
              />
            </Modal>
          </>
        )}
        <ContentWrapper onScroll={handleScroll}>
          <HeaderRow>
            {!mobile ? (
              <>
                <div>Type</div>
                <div>Reason</div>
                <div>From</div>
                <div>Approved</div>
                <div></div>
              </>
            ) : (
              <>
                <div>Punishments</div>
              </>
            )}
          </HeaderRow>
          {punishmentRows}
        </ContentWrapper>
      </Wrapper>
    </BasePageLayout>
  );
};

export default UserPunishments;
