import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import JobsScreen from '../screens/Jobs';
import SavedScreen from '../screens/Saved';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  theme: any;
  toggleTheme: () => void;
  isDarkMode: boolean; 
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ theme, toggleTheme, isDarkMode }) => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="Job Finder">
          {(props) => <JobsScreen {...props} theme={theme} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
        </Stack.Screen>
        <Stack.Screen name="Saved Jobs" component={SavedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
