import styled from "styled-components";
import SVGIcon from "../../../../BasePageLayout.tsx/components/svg/SVG";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.3rem;
  :hover {
    cursor: pointer;
    fill: ${(props) => props.theme.colors.blue};
  }
`;

const SortIcon = styled(SVGIcon)`
  height: 1rem;
  width: 1rem;
`;
export interface HeaderColumnProps {
  label: string;
  sortBy: string;
  setSortBy: () => void;
}

const HeaderColumn: React.FC<HeaderColumnProps> = ({
  label,
  sortBy,
  setSortBy,
}) => {
  return (
    <Wrapper onClick={setSortBy}>
      {label}
      <SortIcon svg="sort" width="20px" />
    </Wrapper>
  );
};

export default HeaderColumn;
