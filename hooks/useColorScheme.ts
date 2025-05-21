import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
    const scheme = useRNColorScheme();
    console.log('Raw scheme:', scheme); // Should log 'dark' or 'light'
    return scheme === 'dark' ? 'dark' : 'light';
}