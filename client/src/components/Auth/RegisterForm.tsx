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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { register: registerUser } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast({
        title: 'Account created!',
        description: 'Welcome to Mono Vault. Your account has been created successfully.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Could not create account. Please try again.',
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
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="Enter your full name"
              {...register('name')}
              focusBorderColor="primary.500"
            />
            {errors.name && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.name.message}
              </Text>
            )}
          </FormControl>

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
                placeholder="Create a strong password"
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

          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                focusBorderColor="primary.500"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  icon={showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </InputRightElement>
            </InputGroup>
            {errors.confirmPassword && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="gradient"
            width="full"
            size="lg"
            isLoading={isLoading}
            loadingText="Creating account..."
          >
            Create Account
          </Button>

          <Text fontSize="sm" textAlign="center">
            Already have an account?{' '}
            <Link
              color="primary.500"
              fontWeight="semibold"
              onClick={onSwitchToLogin}
              cursor="pointer"
            >
              Sign in here
            </Link>
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default RegisterForm;