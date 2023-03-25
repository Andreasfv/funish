import type { NextPage } from "next";
import styled from "styled-components";
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
`;
const punishmentControlPanel: NextPage = () => {
  return (
    <>
      <Wrapper>
        <ContentWrapper>
          <Title>Control Panel</Title>
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default punishmentControlPanel;
