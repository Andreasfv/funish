import styled from "styled-components";
import { BasePageLayout } from "../BasePageLayout.tsx/BasePageLayout";
import CreatePunishment from "./CreatePunishment";

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
  height: 100%;
  max-width: 1200px;
`;

interface PunishmentDashboardProps {}

const PunishmentDashboard: React.FC<PunishmentDashboardProps> = () => {
  return (
    <>
      <BasePageLayout>
        <Wrapper>
          <ContentWrapper>
            <CreatePunishment />
          </ContentWrapper>
        </Wrapper>
      </BasePageLayout>
    </>
  );
};

export default PunishmentDashboard;
