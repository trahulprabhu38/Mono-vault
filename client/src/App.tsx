import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Spinner, Center } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import theme from './theme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Layout/Sidebar';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

const AppContent: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (auth.isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="primary.500" thickness="4px" />
      </Center>
    );
  }

  if (!auth.isAuthenticated) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'bookmarks':
        return <Box p={8}>Bookmarks page coming soon...</Box>;
      case 'passwords':
        return <Box p={8}>Passwords page coming soon...</Box>;
      case 'folders':
        return <Box p={8}>Folders page coming soon...</Box>;
      case 'settings':
        return <Box p={8}>Settings page coming soon...</Box>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box display="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box flex={1} ml="280px">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;