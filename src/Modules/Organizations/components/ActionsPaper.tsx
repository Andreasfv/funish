import styled from "styled-components";
import Spinner from "../../../components/Spiner";

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
`;

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const ActionButton = styled.button`
  width: 200px;
  flex-direction: row;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  background: ${(props) => props.theme.colors.lightGreen};
  padding: 0.5rem;
  border-radius: 0.5rem;

  &:hover {
    background-color: ${(props) => props.theme.colors.lightDarkGreen};
  }
`;
export type ActionStatus = "success" | "error" | "loading" | "info";
interface ActionStatusProps {
  status: ActionStatus;
}

const ActionStatus = styled.div<ActionStatusProps>`
  align-items: center;
  justify-content: center;
  display: flex;

  color: ${(props) => {
    switch (props.status) {
      case "success":
        return props.theme.colors.success;
      case "error":
        return props.theme.colors.error;
      case "loading":
        return props.theme.colors.loading;
      case "info":
        return props.theme.colors.info;
      default:
        return props.theme.colors.info;
    }
  }};
`;

interface ActionsPaperProps {
  actions: ActionProps[];
}
const ActionsPaper: React.FC<ActionsPaperProps> = ({ actions }) => {
  return (
    <ActionsWrapper>
      {actions.map((action, index) => (
        <Action {...action} key={index} />
      ))}
    </ActionsWrapper>
  );
};

interface ActionProps {
  label: string;
  onClick: () => void;
  status: "success" | "error" | "loading" | "info";
  infoMessage: string;
}
const Action: React.FC<ActionProps> = ({
  label,
  onClick,
  status,
  infoMessage,
}) => {
  return (
    <ActionWrapper>
      <ActionButton onClick={onClick}>{label}</ActionButton>
      <ActionStatus status={status}>
        {status == "loading" ? <Spinner /> : infoMessage}
      </ActionStatus>
    </ActionWrapper>
  );
};

export default ActionsPaper;
