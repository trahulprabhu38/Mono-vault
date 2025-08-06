import React from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Home,
  Bookmark,
  Lock,
  Folder,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MotionBox = motion(Box);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { auth, logout } = useAuth();
  const bgGradient = useColorModeValue(
    'linear(to-br, white, purple.50)',
    'linear(to-br, gray.800, purple.900)'
  );
  const borderColor = useColorModeValue('purple.200', 'purple.700');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'passwords', label: 'Passwords', icon: Lock },
    { id: 'folders', label: 'Folders', icon: Folder },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <MotionBox
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      w="280px"
      h="100vh"
      bgGradient={bgGradient}
      borderRight="1px solid"
      borderColor={borderColor}
      backdropFilter="blur(10px)"
      position="fixed"
      left={0}
      top={0}
      zIndex={1000}
    >
      <VStack spacing={0} h="full">
        {/* Logo */}
        <Box p={6} w="full">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, primary.500, secondary.500)"
            bgClip="text"
            textAlign="center"
          >
            🔒 Mono Vault
          </Text>
        </Box>

        {/* User Profile */}
        <Box p={4} w="full">
          <Flex align="center" gap={3} p={3} rounded="xl" bg="whiteAlpha.100">
            <Avatar size="sm" name={auth.user?.name} />
            <Box>
              <Text fontSize="sm" fontWeight="semibold">
                {auth.user?.name}
              </Text>
              <Text fontSize="xs" opacity={0.7}>
                {auth.user?.email}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Navigation */}
        <VStack spacing={2} flex={1} w="full" px={4}>
          {menuItems.map((item) => (
            <MotionBox
              key={item.id}
              w="full"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Flex
                align="center"
                gap={3}
                p={3}
                rounded="xl"
                cursor="pointer"
                bg={activeTab === item.id ? 'primary.500' : 'transparent'}
                color={activeTab === item.id ? 'white' : 'inherit'}
                _hover={{
                  bg: activeTab === item.id ? 'primary.600' : 'whiteAlpha.100',
                }}
                onClick={() => setActiveTab(item.id)}
                transition="all 0.2s"
              >
                <Icon as={item.icon} size="20px" />
                <Text fontSize="sm" fontWeight="medium">
                  {item.label}
                </Text>
              </Flex>
            </MotionBox>
          ))}
        </VStack>

        {/* Logout */}
        <Box p={4} w="full">
          <MotionBox whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <Flex
              align="center"
              gap={3}
              p={3}
              rounded="xl"
              cursor="pointer"
              _hover={{ bg: 'red.500', color: 'white' }}
              onClick={logout}
              transition="all 0.2s"
            >
              <Icon as={LogOut} size="20px" />
              <Text fontSize="sm" fontWeight="medium">
                Logout
              </Text>
            </Flex>
          </MotionBox>
        </Box>
      </VStack>
    </MotionBox>
  );
};

export default Sidebar;