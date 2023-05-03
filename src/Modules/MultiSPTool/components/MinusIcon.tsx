import styled from "styled-components";

const IconWrapper = styled.div<{
  boxSize: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 3px solid ${(props) => props.theme.colors.red};
  color: ${(props) => props.theme.colors.red};
  font-size: 2rem;
  text-align: center;

  :hover {
    cursor: pointer;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    & ~ .text {
      color: ${(props) => props.theme.colors.spPurple};
      filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }
  }

  ${(props) =>
    props.boxSize &&
    `
        width: ${props.boxSize};
        height: ${props.boxSize};
        min-width: ${props.boxSize};
        min-height: ${props.boxSize};
    `}
`;

const IconText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-bottom: 0.25rem;
`;

interface PlusIconProps {
  boxSize?: string;
  onClick?: () => void;
}
const MinusIcon: React.FC<PlusIconProps> = ({ boxSize = "40px", onClick }) => {
  return (
    <IconWrapper boxSize={boxSize} onClick={onClick}>
      <IconText>-</IconText>
    </IconWrapper>
  );
};

export default MinusIcon;
