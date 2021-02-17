import { useCallback, useState } from "react";

export const useProfileHeader = initialState => {
  const [showWrappers, setShowWrappers] = useState(initialState);

  const showHandler = useCallback(() => {
    if (window.innerWidth <= 750) {
      setShowWrappers(true);
    } else {
      setShowWrappers(false);
    }
  }, []);

  return [showWrappers, showHandler];
};
