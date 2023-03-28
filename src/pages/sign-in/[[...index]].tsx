import { SignIn, useSignIn } from "@clerk/nextjs";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const SignInPage = () => {
  return (
    <Wrapper>
      <SignIn path="/sign-in" routing="path" redirectUrl="/redirect" />
    </Wrapper>
  );
};
export default SignInPage;
