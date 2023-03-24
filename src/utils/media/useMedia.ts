import { useState, useEffect, useContext } from "react";
import { ThemeContext, DefaultTheme as Theme } from "styled-components";

export function useDevices() {
  function useMediaQuery(queries: string[]) {
    const [matches, setMatches] = useState<boolean[]>([]);

    useEffect(() => {
      const matchesFound: boolean[] = [];
      queries.map((query, index) => {
        const media = window.matchMedia(query);
        if (media.matches !== matches[index]) {
          matchesFound[index] = media.matches;
        }
        const listener = () => {
          matchesFound[index] = media.matches;
        };
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
      });
      setMatches(matchesFound);
    }, [matches, queries]);

    return matches;
  }

  const theme: Theme = useContext(ThemeContext);

  const queries = Object.entries(theme.media).map(([_, value]) => value);

  const devices = useMediaQuery(queries);

  return devices;
}
