import styled from 'styled-components';


const Button = styled.button`
    display: flex;
    width: 100%;
    height: 2.5rem;
    background-color: ${(props) => props.theme.colors.lightDarkGreen};
    border-radius: 0.3rem;
    align-items: center;
    justify-content: center;
    font-weight: 600;

    &:hover {
        background-color: ${(props) => props.theme.colors.darkGreen};
    }

    focus: {
        background: ${(props) => props.theme.colors.green};
    }
`

export default Button;