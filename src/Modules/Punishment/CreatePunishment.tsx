import React from "react";
import styled from "styled-components";
import { api } from "../../utils/api";

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

  return <></>;
};
export default CreatePunishment;
