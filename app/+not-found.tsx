import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';

export default function NotFoundScreen() {
   const { t } = useTranslation();
  return (
    <>
     <Stack.Screen options={{ title: t('Oops!') }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title">{t('This screen does not exist.')}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{t('Go to home screen!')}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
