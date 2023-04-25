import { useEffect } from "react";

export const useKeydown = (key: string, handler: () => void, deps = []) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === key) {
        void handler();
      }
    };
    document?.addEventListener("keydown", handleKeydown);
    return () => {
      document?.removeEventListener("keydown", handleKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, key, ...deps]);
};
