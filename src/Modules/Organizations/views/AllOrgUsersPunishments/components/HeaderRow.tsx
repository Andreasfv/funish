import styled from "styled-components";
import type { HeaderColumnProps } from "./HeaderColumn";
import HeaderColumn from "./HeaderColumn";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 3rem;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.lightDarkGreen};
  border-radius: 0.5rem;

  & > *:first-child {
    margin-left: 32px;
    @media ${(props) => props.theme.media.largeMobile} {
      flex: 2;
    }
  }
`;

interface HeaderRowProps {
  columns: Omit<HeaderColumnProps, "sortBy">[];
  orderBy: string;
}

const HeaderRow: React.FC<HeaderRowProps> = ({ columns, orderBy: sortBy }) => {
  return (
    <Wrapper>
      {columns.map((column, i) => (
        <HeaderColumn key={i} {...column} sortBy={sortBy} />
      ))}
    </Wrapper>
  );
};

export default HeaderRow;
