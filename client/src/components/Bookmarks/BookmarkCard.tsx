import React from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MoreVertical, Star, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Bookmark } from '../../types';

const MotionBox = motion(Box);

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onEdit,
  onDelete,
  onToggleStar,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleClick = () => {
    window.open(bookmark.url, '_blank');
  };

  return (
    <MotionBox
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        p={4}
        bg={cardBg}
        rounded="xl"
        border="1px solid"
        borderColor={borderColor}
        shadow="sm"
        _hover={{ shadow: 'md', borderColor: 'primary.300' }}
        transition="all 0.2s"
        cursor="pointer"
        position="relative"
      >
        <Flex justify="space-between" align="start" mb={3}>
          <Flex align="center" gap={3} flex={1} onClick={handleClick}>
            <Image
              src={bookmark.favicon}
              alt=""
              w={6}
              h={6}
              rounded="md"
              fallback={<Box w={6} h={6} bg="primary.500" rounded="md" />}
            />
            <Box flex={1} minW={0}>
              <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                {bookmark.title}
              </Text>
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {new URL(bookmark.url).hostname}
              </Text>
            </Box>
          </Flex>

          <Flex align="center" gap={1}>
            {bookmark.isStarred && (
              <Star size={14} fill="yellow.400" color="yellow.400" />
            )}
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MoreVertical size={16} />}
                variant="ghost"
                size="xs"
              />
              <MenuList>
                <MenuItem
                  icon={<ExternalLink size={16} />}
                  onClick={handleClick}
                >
                  Open
                </MenuItem>
                <MenuItem
                  icon={<Star size={16} />}
                  onClick={() => onToggleStar(bookmark.id)}
                >
                  {bookmark.isStarred ? 'Unstar' : 'Star'}
                </MenuItem>
                <MenuItem
                  icon={<Edit size={16} />}
                  onClick={() => onEdit(bookmark)}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  icon={<Trash2 size={16} />}
                  onClick={() => onDelete(bookmark.id)}
                  color="red.500"
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {bookmark.clickCount > 0 && (
          <Badge size="sm" colorScheme="purple" fontSize="xs">
            {bookmark.clickCount} visits
          </Badge>
        )}
      </Box>
    </MotionBox>
  );
};

export default BookmarkCard;