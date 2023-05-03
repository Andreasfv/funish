import styled from "styled-components";
import PlusIcon from "./PlusIcon";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

interface AddSPButtonProps {
  onClick: () => void;
}
const AddSPButton: React.FC<AddSPButtonProps> = ({ onClick }) => {
  return (
    <Wrapper>
      <PlusIcon onClick={onClick} boxSize="34px" /> Legg til SP
    </Wrapper>
  );
};

export default AddSPButton;
