import styled from "styled-components";
import { Header as AntHeader } from "antd/es/layout/layout";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
`;

export const Header: React.FC = () => {
  return (
    <AntHeader>
      <div className="logo"> something org name</div>
    </AntHeader>
  );
};
