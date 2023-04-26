import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  justify-content: flex-start;

  padding: 1rem;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.lightGreen};
  gap: 0.4rem;
  max-height: 600px;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  box-shadow: ${(props) => props.theme.shadow.wrapperShadow};
  border-radius: 0.5rem;
`;

export const ActionsContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.lightGreen};
  gap: 0.4rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  box-shadow: ${(props) => props.theme.shadow.wrapperShadow};
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

export const FormText = styled.div`
  font-xsize: 1.2rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 2.5rem;
  background-color: ${(props) => props.theme.colors.darkGreen};
  padding: 0.5rem;
  border-radius: 0.5rem;
  div {
    display: flex;
    flex: 1;
    align-items: center;
  }
  @media ${(props) => props.theme.media.largeMobile} {
    & > :first-child {
      flex: 2;
    }
  }

  & > :last-child {
    min-width: 175px;
    @media ${(props) => props.theme.media.largeMobile} {
      min-width: 80px;
      max-width: 90px;
    }
  }
`;

export const ActionsButton = styled.button`
  margin-left: auto;
  display: flex;
  min-width: 150px;
  max-width: 200px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.lightDarkGreen};
  font-size: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;

  :hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;
