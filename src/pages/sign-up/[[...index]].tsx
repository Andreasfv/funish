import { SignUp } from "@clerk/nextjs";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const SignUpPage = () => (
  <Wrapper>
    <SignUp path="/sign-up" routing="path" redirectUrl="/redirect" />
  </Wrapper>
);
export default SignUpPage;
