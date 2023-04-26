import type {
  Punishment,
  PunishmentReason,
  PunishmentType,
} from "@prisma/client";
import type { User } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useModal } from "react-hooks-use-modal";
import styled from "styled-components";
import { useAdmin } from "../../../utils/admin/useAdmin";
import { api } from "../../../utils/api";
import { useImageModal } from "../../../utils/hooks/useImageModal";
import { useMediaQuery } from "../../../utils/media/useMedia";
import theme from "../../../utils/theme";
import { BasePageLayout } from "../../BasePageLayout.tsx/view/BasePageLayout";
import {
  ActionsButton,
  ActionsContentWrapper,
  ContentWrapper,
  FormText,
  FormWrapper,
  HeaderRow,
  Wrapper,
} from "../components/components";
import PunishmentRow from "../components/PunishmentRow";
import RedeemPunishmentsModal from "../components/RedeemPunishmentsModal";

const UserImage = styled(Image)`
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
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
  const [ImageModal, openImage] = useImageModal();
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
    focusTrapOptions: {
      clickOutsideDeactivates: true,
    },
  });

  const [punishmentRows, setPunishmentRows] = useState<JSX.Element[]>([]);

  const { userId, organizationId } = router.query;
  const { data: user } = api.users.getUser.useQuery((userId as string) ?? "", {
    enabled: !!userId,
  });

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

  const { data: punishmentTypes } =
    api.punishmentTypes.getPunishmentTypes.useQuery(
      {
        organizationId: organizationId as string,
      },
      {
        enabled: !!organizationId && isAdmin && isOpen,
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
              openProof={openImage}
            />
          );
        });
      })
      .flat();
    setPunishmentRows(punishmentRows);
  }, [approvePunishment, data, deletePunishment, openImage]);

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
        <ImageModal />
        <>
          <ActionsContentWrapper>
            <FormWrapper>
              <UserImage
                src={user?.data?.user?.image ?? ""}
                width={50}
                height={50}
                alt=":)"
              />
              <FormText>{user?.data?.user?.name}</FormText>
              {isAdmin && (
                <ActionsButton onClick={open}>Redeem SP</ActionsButton>
              )}
            </FormWrapper>
          </ActionsContentWrapper>
          <Modal>
            <RedeemPunishmentsModal
              userId={userId as string}
              organizationId={organizationId as string}
              punishmentTypes={punishmentTypes?.data?.punishmentTypes ?? []}
              refetch={handleRefetch}
              close={close}
            />
          </Modal>
        </>
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
                <div>Straffepils</div>
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
