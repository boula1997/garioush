import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme(); // don't need fallback here
  const colorFromProps = props[theme];

  return colorFromProps ?? Colors[theme][colorName];
}
