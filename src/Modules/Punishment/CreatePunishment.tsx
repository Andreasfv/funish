import React from "react";
import styled from "styled-components";
import { api } from "../../utils/api";

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
  max-width: 700px;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const input = styled.input``;
const CreatePunishment: React.FC = () => {
  const { data: myOrganization } =
    api.organizations.getMyOrganization.useQuery();
  function onFinish(values: any) {
    console.log("Success:", values);
  }
  function onFinishFailed(errorInfo: any) {
    console.log("Failed:", errorInfo);
  }

  return (
    <>
      <Wrapper>
        <ContentWrapper>
          <p>Reason</p>
          <input type="text" />
        </ContentWrapper>
      </Wrapper>
    </>
  );
};
export default CreatePunishment;
