import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useToast,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MoreVertical, Eye, EyeOff, Copy, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Password } from '../../types';
import { encryptionService } from '../../services/encryption';

const MotionBox = motion(Box);

interface PasswordCardProps {
  password: Password;
  masterPassword: string;
  onEdit: (password: Password) => void;
  onDelete: (id: string) => void;
}

const PasswordCard: React.FC<PasswordCardProps> = ({
  password,
  masterPassword,
  onEdit,
  onDelete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState('');
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleTogglePassword = async () => {
    if (!showPassword && !decryptedPassword) {
      try {
        const decrypted = await encryptionService.decrypt(password.encryptedPassword, masterPassword);
        setDecryptedPassword(decrypted);
      } catch (error) {
        toast({
          title: 'Decryption failed',
          description: 'Invalid master password',
          status: 'error',
          duration: 3000,
        });
        return;
      }
    }
    setShowPassword(!showPassword);
  };

  const handleCopyPassword = async () => {
    try {
      let passwordToCopy = decryptedPassword;
      if (!passwordToCopy) {
        passwordToCopy = await encryptionService.decrypt(password.encryptedPassword, masterPassword);
      }
      await navigator.clipboard.writeText(passwordToCopy);
      toast({
        title: 'Password copied',
        description: 'Password has been copied to clipboard',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy password',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleOpenUrl = () => {
    if (password.url) {
      window.open(password.url, '_blank');
    }
  };

  return (
    <MotionBox
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Box
        p={4}
        bg={cardBg}
        rounded="xl"
        border="1px solid"
        borderColor={borderColor}
        shadow="sm"
        _hover={{ shadow: 'md', borderColor: 'accent.300' }}
        transition="all 0.2s"
      >
        <Flex justify="space-between" align="start" mb={3}>
          <Box flex={1}>
            <Text fontWeight="semibold" fontSize="md" mb={1}>
              {password.title}
            </Text>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {password.username}
            </Text>
            
            <Flex align="center" gap={2} mb={2}>
              <Text fontSize="sm" color="gray.400">
                Password:
              </Text>
              <Text fontSize="sm" fontFamily="mono">
                {showPassword ? decryptedPassword : '••••••••'}
              </Text>
              <IconButton
                icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                size="xs"
                variant="ghost"
                onClick={handleTogglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              />
              <IconButton
                icon={<Copy size={16} />}
                size="xs"
                variant="ghost"
                onClick={handleCopyPassword}
                aria-label="Copy password"
              />
            </Flex>

            {password.url && (
              <Badge
                size="sm"
                colorScheme="blue"
                cursor="pointer"
                onClick={handleOpenUrl}
              >
                {new URL(password.url).hostname}
              </Badge>
            )}
          </Box>

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MoreVertical size={16} />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              {password.url && (
                <MenuItem
                  icon={<ExternalLink size={16} />}
                  onClick={handleOpenUrl}
                >
                  Open URL
                </MenuItem>
              )}
              <MenuItem
                icon={<Copy size={16} />}
                onClick={handleCopyPassword}
              >
                Copy Password
              </MenuItem>
              <MenuItem
                icon={<Edit size={16} />}
                onClick={() => onEdit(password)}
              >
                Edit
              </MenuItem>
              <MenuItem
                icon={<Trash2 size={16} />}
                onClick={() => onDelete(password.id)}
                color="red.500"
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {password.notes && (
          <Text fontSize="xs" color="gray.500" mt={2}>
            {password.notes}
          </Text>
        )}
      </Box>
    </MotionBox>
  );
};

export default PasswordCard;