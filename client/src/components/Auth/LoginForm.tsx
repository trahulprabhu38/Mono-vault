import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const MotionBox = motion(Box);

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              focusBorderColor="primary.500"
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                focusBorderColor="primary.500"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.password.message}
              </Text>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="gradient"
            width="full"
            size="lg"
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign In
          </Button>

          <Text fontSize="sm" textAlign="center">
            Don't have an account?{' '}
            <Link
              color="primary.500"
              fontWeight="semibold"
              onClick={onSwitchToRegister}
              cursor="pointer"
            >
              Sign up here
            </Link>
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default LoginForm;