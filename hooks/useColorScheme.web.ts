// hooks/useColorScheme.ts
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Returns the current system color scheme ('light' or 'dark').
 * On web, returns 'light' during static rendering before hydration.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemColorScheme = useRNColorScheme(); // native hook

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated ? (systemColorScheme ?? 'light') : 'light';
}

