import styled from "styled-components";
import Link from "next/link";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

export const AdminDashboardPanel: React.FC = () => {
  return (
    <Wrapper>
      <ContentWrapper>
        <Link href="/punishmentControlPanel">Control Panel</Link>
      </ContentWrapper>
    </Wrapper>
  );
};
