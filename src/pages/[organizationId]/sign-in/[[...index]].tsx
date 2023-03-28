import styled from "styled-components";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.lightGreen};
`;

const SignInPage = () => {
  const router = useRouter();
  const { organizationId } = router.query;
  const { signIn, isLoaded } = useSignIn();
  const signUp = useSignUp();
  function handleSignIn() {}
  const [name, setName] = useState("");
  return (
    <Wrapper>
      <ContentWrapper>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={handleSignIn}>Sign Up</button>
      </ContentWrapper>
    </Wrapper>
  );
};

export default SignInPage;
