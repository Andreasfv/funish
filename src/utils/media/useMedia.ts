import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "styled-components";
import { Theme } from "../theme";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export function useDevices() {
  const theme: Theme = useContext(ThemeContext);

  const devices = Object.entries(theme.media).map(([key, value]) => {
    return useMediaQuery(value);
  });

  return devices;
}
