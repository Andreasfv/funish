import { useSession } from "next-auth/react";
import { BasePageLayout } from "../../../Modules/BasePageLayout.tsx/view/BasePageLayout";
import AccountInfo from "../../../Modules/User/AccountInfo";

const MyAccount: React.FC = () => {
  const session = useSession();
  const { data: sessionData } = session;
  return (
    <BasePageLayout>
      {sessionData && sessionData.user && (
        <AccountInfo user={sessionData.user} />
      )}
    </BasePageLayout>
  );
};

export default MyAccount;
