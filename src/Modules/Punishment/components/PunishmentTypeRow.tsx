import type { PunishmentType } from "@prisma/client";
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
  punishmentType: PunishmentType;
  refetch: () => void;
}
const PunishmentTypeRow: React.FC<PunishmentTypeRowProps> = ({
  punishmentType,
  refetch,
}) => {
  const { mutate: deletePunishmentType } =
    api.punishmentTypes.deletePunishmentType.useMutation();

  function handleDelete() {
    deletePunishmentType(punishmentType.id, {
      onSuccess: () => {
        toast("Punishment type deleted", {
          type: "success",
          position: "bottom-center",
        }
          )
        refetch();
      },
      onError: () => {
        toast("Cannot delete type with existing punishments", {
          type: "error",
          position: "bottom-center",
        }
          )
      }
    });
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <div>{punishmentType.name}</div>
        <div>Quantity required: {punishmentType.quantityToFulfill}</div>
        <button onClick={handleDelete}>delete</button>
      </ContentWrapper>
    </Wrapper>
  );
};

export default PunishmentTypeRow;
