import { useRouter } from "next/router";
import { useEffect } from "react";

interface RedirectProps {
  to: string;
}
const Redirect: React.FC<RedirectProps> = ({ to }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to).catch((err) => console.warn(err));
  }, []);
  return <></>;
};

export default Redirect;
