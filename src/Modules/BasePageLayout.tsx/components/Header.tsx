import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 4rem;
  padding: 0.5rem;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.lightDarkGreen};
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Wrapper>
      <ContentWrapper>
        <h1>Header</h1>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Header;
