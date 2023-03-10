import styled from "styled-components";
import Spinner from "../../components/Spiner";
import { api } from "../../utils/api";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 200px;
  background-color: white;
  border-radius: 0.7rem;
  padding: 1rem;
  box-shadow: ${(props) => props.theme.shadow.cardShadow};
`;

const NumberWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 2rem;
  font-weight: bold;
`;

interface PunishmentCardProps {
  punishmentType: string | undefined;
  count: number | undefined;
}

const PunishmentCard: React.FC<PunishmentCardProps> = ({
  punishmentType,
  count,
}) => {
  //   const { data: userData, isLoading: userLoading } = api.users.getUser.useQuery(
  //     userId ?? "",
  //     { enabled: !!userId }
  //   );
  //   if (userLoading || punishmentTypeLoading || punishmentLoading) {
  //     return (
  //       <Card>
  //         <Spinner />
  //       </Card>
  //     );
  //   }
  return (
    <Card>
      <p>{punishmentType}</p>
      <NumberWrapper>{count}</NumberWrapper>
    </Card>
  );
};

export default PunishmentCard;
