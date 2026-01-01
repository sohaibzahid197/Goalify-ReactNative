import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../state/store';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingStep1 from '../screens/OnboardingStep1';
import OnboardingStep2 from '../screens/OnboardingStep2';
import OnboardingStep3 from '../screens/OnboardingStep3';
import OnboardingStep4 from '../screens/OnboardingStep4';
import HomeScreen from '../screens/HomeScreen';
import StreakScreen from '../screens/StreakScreen';
import ChallengeHistoryScreen from '../screens/ChallengeHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChallengeCreationScreen from '../screens/ChallengeCreationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Ensure icons are loaded
Icon.loadFont();

/**
 * Main Tab Navigator
 * Bottom tab navigation for main app screens
 */
function MainTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate proper tab bar height
  const tabBarHeight = Platform.select({
    android: 120, // Fixed height for Android
    ios: 50 + (insets.bottom || 0), // iOS needs bottom inset for home indicator
    default: 60,
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.surfaceVariant,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#06b6d4',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: Platform.select({
            android: 8,
            ios: insets.bottom > 0 ? insets.bottom : 8,
            default: 8,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'circle';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Streak':
              iconName = focused ? 'fire' : 'fire-outline';
              break;
            case 'ChallengeHistory':
              iconName = focused ? 'history' : 'clock-outline';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
          }

          return (
            <Icon
              name={iconName}
              size={24}
              color={color}
              style={styles.icon}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Streak"
        component={StreakScreen}
        options={{
          title: 'Streak',
          tabBarLabel: 'Streak',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ChallengeHistory"
        component={ChallengeHistoryScreen}
        options={{
          title: 'History',
          tabBarLabel: 'History',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 * Stack navigation for app flow (Splash -> Onboarding -> Main App)
 */
function AppNavigator() {
  const user = useStore((state) => state.user);
  const isOnboardingCompleted = user?.onboardingCompleted || false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureResponseDistance: 150,
          fullScreenGestureEnabled: false,
          animationEnabled: true,
        }}
        initialRouteName={isOnboardingCompleted ? 'Main' : 'Splash'}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="OnboardingStep1"
          component={OnboardingStep1}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="OnboardingStep2"
          component={OnboardingStep2}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="OnboardingStep3"
          component={OnboardingStep3}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="OnboardingStep4"
          component={OnboardingStep4}
          options={{
            gestureEnabled: true,
          }}
        />

        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ChallengeCreation"
          component={ChallengeCreationScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureResponseDistance: 200,
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
            animationTypeForReplace: 'push',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    // Ensure icon renders properly
    alignSelf: 'center',
  },
});

export default AppNavigator;