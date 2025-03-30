import React, { useState, useMemo } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider, DarkTheme, DefaultTheme } from 'react-native-paper';
import AppNavigator from './components/navigation/AppNavigator';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () => (isDarkMode ? DarkTheme : DefaultTheme),
    [isDarkMode]
  );

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
        <AppNavigator theme={theme} toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    marginTop: StatusBar.currentHeight,
  },
});

export default App;
