import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const MotionBox = motion(Box);

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const bgGradient = useColorModeValue(
    'linear(to-br, purple.400, blue.400)',
    'linear(to-br, purple.600, blue.600)'
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient} display="flex" alignItems="center">
      <Container maxW="md">
        <VStack spacing={8}>
          {/* Logo and Header */}
          <MotionBox
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Text fontSize="4xl" fontWeight="bold" color="white" mb={2}>
              🔒 Mono Vault
            </Text>
            <Text color="whiteAlpha.800" fontSize="lg">
              Your secure bookmark and password manager
            </Text>
          </MotionBox>

          {/* Auth Card */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            w="full"
          >
            <Card
              variant="elevated"
              shadow="2xl"
              borderRadius="2xl"
              overflow="hidden"
              backdropFilter="blur(10px)"
              bg="rgba(255, 255, 255, 0.95)"
            >
              <CardBody p={8}>
                <VStack spacing={6}>
                  <Heading
                    size="xl"
                    textAlign="center"
                    bgGradient="linear(to-r, primary.500, secondary.500)"
                    bgClip="text"
                  >
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </Heading>

                  {isLogin ? (
                    <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                  ) : (
                    <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                  )}
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Features */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Flex justify="center" gap={8} color="whiteAlpha.800" fontSize="sm">
              <Text>🔐 End-to-end encryption</Text>
              <Text>🌐 Cross-device sync</Text>
              <Text>🔧 Browser extension</Text>
            </Flex>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default Auth;