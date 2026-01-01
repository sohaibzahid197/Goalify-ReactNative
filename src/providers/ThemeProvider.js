/**
 * Theme Provider
 * Manages app theme (light/dark mode) with React Native Paper
 * Now synced with Zustand store for consistent theme management
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '../assets/theme';
import useStore from '../state/store';

const ThemeContext = createContext({
    isDarkMode: false,
    toggleTheme: () => { },
    theme: lightTheme,
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const settings = useStore((state) => state.settings);
    const updateSettings = useStore((state) => state.updateSettings);
    
    // Calculate if dark mode should be active
    // Priority: settings.theme > system preference
    const isDarkMode = useMemo(() => {
        if (settings.theme === 'dark') return true;
        if (settings.theme === 'light') return false;
        // If no theme set or theme is 'system', use system preference
        return systemColorScheme === 'dark';
    }, [settings.theme, systemColorScheme]);
    
    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        updateSettings({ theme: newTheme });
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
