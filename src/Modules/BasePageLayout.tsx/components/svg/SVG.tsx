import { useMemo } from "react";
import { Sort } from "./source/Sort";

interface SVGProps {
  svg: SPIcon;
  width?: string;
  height?: string;
}

export type SPIcon = "sort";

const SVGIcon: React.FC<SVGProps> = ({ svg, ...props }) => {
  const SVGElement = useMemo(() => {
    switch (svg) {
      case "sort":
        return Sort;
    }
  }, [svg]);

  return <SVGElement {...props} />;
};

export default SVGIcon;
