import type { PunishmentReason } from "@prisma/client";
import { toast } from "react-toastify";
import styled from "styled-components";
import { api } from "../../../utils/api";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  background-color: ${(props) => props.theme.colors.green};
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: flex-start;
  width: 100%;
  gap: 1rem;
  div {
    flex: 1;
  }
`;

interface PunishmentTypeRowProps {
  punishmentReason: PunishmentReason;
  refetch: () => void;
}
const PunishmentReasonRow: React.FC<PunishmentTypeRowProps> = ({
  punishmentReason,
  refetch,
}) => {
  const { mutate: deletePunishmentReason } =
    api.punishmentReasons.deletePunishmentReason.useMutation();

  function handleDelete() {
    deletePunishmentReason(punishmentReason.id, {
      onSuccess: () => {
        toast("Punishment reason deleted", {
          type: "success",
          position: "bottom-center",
        });
        refetch();
      },
      onError: (err) => {
        toast(err.message, {
          type: "error",
          position: "bottom-center",
        });
      },
    });
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <div>{punishmentReason.name}</div>
        <div>Desc: {punishmentReason.description}</div>
        <button onClick={handleDelete}>delete</button>
      </ContentWrapper>
    </Wrapper>
  );
};

export default PunishmentReasonRow;
