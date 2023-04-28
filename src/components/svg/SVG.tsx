import { useMemo } from "react";
import { Sort, Menu } from "./icons";
interface SVGProps {
  svg: SPIcon;
  width?: string;
  height?: string;
  onClick?: () => void;
}

export type SPIcon = "sort" | "menu";

const SVGIcon: React.FC<SVGProps> = ({ svg, ...props }) => {
  const SVGElement = useMemo(() => {
    switch (svg) {
      case "sort":
        return Sort;
      case "menu":
        return Menu;
    }
  }, [svg]);

  return <SVGElement {...props} />;
};

export default SVGIcon;
