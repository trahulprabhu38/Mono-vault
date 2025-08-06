import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorModeValue,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Search, Plus, Bookmark, Lock, Folder, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { bookmarksAPI, passwordsAPI, foldersAPI } from '../services/api';
import { Bookmark as BookmarkType, Password, Folder as FolderType } from '../types';
import StatsCard from '../components/Dashboard/StatsCard';
import BookmarkCard from '../components/Bookmarks/BookmarkCard';
import { encryptionService } from '../services/encryption';

const MotionBox = motion(Box);

const Dashboard: React.FC = () => {
  const { auth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isOpen: isFolderOpen,
    onOpen: onFolderOpen,
    onClose: onFolderClose,
  } = useDisclosure();
  const {
    isOpen: isBookmarkOpen,
    onOpen: onBookmarkOpen,
    onClose: onBookmarkClose,
  } = useDisclosure();
  const {
    isOpen: isPasswordOpen,
    onOpen: onPasswordOpen,
    onClose: onPasswordClose,
  } = useDisclosure();

  // Folder form state
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#6B46C1');
  // Bookmark form state
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [bookmarkUrl, setBookmarkUrl] = useState('');
  const [bookmarkFolder, setBookmarkFolder] = useState('');
  // Password form state
  const [passwordTitle, setPasswordTitle] = useState('');
  const [passwordUsername, setPasswordUsername] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordUrl, setPasswordUrl] = useState('');
  const [passwordNotes, setPasswordNotes] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  // Add state for folder modal
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderBookmarks, setFolderBookmarks] = useState<BookmarkType[]>([]);

  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, blue.50)',
    'linear(to-br, gray.900, purple.900)'
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookmarksData, passwordsData, foldersData] = await Promise.all([
          bookmarksAPI.getAll(),
          passwordsAPI.getAll(),
          foldersAPI.getAll(),
        ]);

        setBookmarks(bookmarksData);
        setPasswords(passwordsData);
        setFolders(foldersData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const recentBookmarks = bookmarks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const popularBookmarks = bookmarks
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 3);

  const filteredBookmarks = recentBookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box p={8}>
        <Text>Loading dashboard...</Text>
      </Box>
    );
  }

  // Handlers
  const handleCreateFolder = async () => {
    try {
      const newFolder = await foldersAPI.create({ name: folderName, color: folderColor });
      setFolders([...folders, newFolder]);
      setFolderName('');
      setFolderColor('#6B46C1');
      onFolderClose();
    } catch (e) { alert('Error creating folder'); }
  };
  const handleCreateBookmark = async () => {
    try {
      const newBookmark = await bookmarksAPI.create({
        title: bookmarkTitle,
        url: bookmarkUrl,
        folder: bookmarkFolder, // <-- fix here
      });
      setBookmarks([...bookmarks, newBookmark]);
      setBookmarkTitle('');
      setBookmarkUrl('');
      setBookmarkFolder('');
      onBookmarkClose();
    } catch (e) { alert('Error creating bookmark'); }
  };
  const handleCreatePassword = async () => {
    try {
      if (!masterPassword) return alert('Enter your master password for encryption');
      const encryptedPassword = await encryptionService.encrypt(passwordValue, masterPassword);
      const newPassword = await passwordsAPI.create({
        title: passwordTitle,
        username: passwordUsername,
        encryptedPassword,
        url: passwordUrl,
        notes: passwordNotes,
      });
      setPasswords([...passwords, newPassword]);
      setPasswordTitle('');
      setPasswordUsername('');
      setPasswordValue('');
      setPasswordUrl('');
      setPasswordNotes('');
      setMasterPassword('');
      onPasswordClose();
    } catch (e) { alert('Error creating password'); }
  };

  // Handler for opening folder modal
  const handleOpenFolder = (folder: FolderType) => {
    setSelectedFolder(folder);
    setFolderBookmarks(bookmarks.filter(b => (b.folderId || b.folder) === (folder.id || folder._id)));
    setIsFolderModalOpen(true);
  };
  const handleCloseFolderModal = () => {
    setIsFolderModalOpen(false);
    setSelectedFolder(null);
    setFolderBookmarks([]);
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Section */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={4} align="start">
              <Heading size="2xl" bgGradient="linear(to-r, primary.500, secondary.500)" bgClip="text">
                Welcome back, {auth.user?.name}! 👋
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Here's what's happening with your secure vault today.
              </Text>
            </VStack>
          </MotionBox>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatsCard
              title="Total Bookmarks"
              value={bookmarks.length}
              subtitle="Organized links"
              icon={Bookmark}
              color="purple.500"
              index={0}
            />
            <StatsCard
              title="Saved Passwords"
              value={passwords.length}
              subtitle="Encrypted securely"
              icon={Lock}
              color="blue.500"
              index={1}
            />
            <StatsCard
              title="Folders"
              value={folders.length}
              subtitle="Custom categories"
              icon={Folder}
              color="green.500"
              index={2}
            />
            <StatsCard
              title="Total Visits"
              value={bookmarks.reduce((sum, b) => sum + b.clickCount, 0)}
              subtitle="This month"
              icon={TrendingUp}
              color="orange.500"
              index={3}
            />
          </SimpleGrid>

          {/* Search Bar */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <InputGroup size="lg" maxW="500px" mx="auto">
              <InputLeftElement pointerEvents="none">
                <Search color="gray.400" size={20} />
              </InputLeftElement>
              <Input
                placeholder="Search bookmarks, passwords, or folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="white"
                shadow="sm"
                _focus={{ shadow: 'md' }}
              />
            </InputGroup>
          </MotionBox>

          {/* Quick Actions */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <HStack spacing={4} justify="center">
              <Button leftIcon={<Plus size={20} />} colorScheme="purple" variant="solid" onClick={onBookmarkOpen}>
                Add Bookmark
              </Button>
              <Button leftIcon={<Lock size={20} />} colorScheme="blue" variant="outline" onClick={onPasswordOpen}>
                New Password
              </Button>
              <Button leftIcon={<Folder size={20} />} colorScheme="green" variant="outline" onClick={onFolderOpen}>
                Create Folder
              </Button>
            </HStack>
          </MotionBox>

          {/* Content Sections */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Recent Bookmarks */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Heading size="lg">Recent Bookmarks</Heading>
                  <Badge colorScheme="purple">{filteredBookmarks.length} items</Badge>
                </Flex>
                <SimpleGrid columns={1} spacing={3}>
                  {filteredBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onToggleStar={() => {}}
                    />
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>

            {/* Popular Bookmarks */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Heading size="lg">Most Visited</Heading>
                  <Badge colorScheme="orange">{popularBookmarks.length} items</Badge>
                </Flex>
                <SimpleGrid columns={1} spacing={3}>
                  {popularBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onToggleStar={() => {}}
                    />
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          </SimpleGrid>

          {/* Folder display section (flashy UI) */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <Heading size="lg" mb={4} textAlign="center" bgGradient="linear(to-r, green.400, blue.400, purple.500)" bgClip="text">
              Your Folders
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={8}>
              {folders.map(folder => (
                <MotionBox
                  key={folder.id || folder._id}
                  whileHover={{ scale: 1.07, boxShadow: '0 0 20px 5px #805ad5' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  bg={folder.color || 'purple.100'}
                  borderRadius="xl"
                  p={6}
                  boxShadow="lg"
                  borderWidth={2}
                  borderColor={folder.color || 'purple.300'}
                  textAlign="center"
                  position="relative"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => handleOpenFolder(folder)}
                >
                  <Box
                    position="absolute"
                    top={-6}
                    right={-6}
                    bgGradient="linear(to-br, whiteAlpha.700, transparent)"
                    w={24}
                    h={24}
                    borderRadius="full"
                    zIndex={0}
                  />
                  <Folder size={36} color={folder.color || '#6B46C1'} style={{ marginBottom: 8, zIndex: 1 }} />
                  <Text fontWeight="bold" fontSize="xl" color="gray.800" zIndex={1}>{folder.name}</Text>
                  <Text fontSize="sm" color="gray.500" zIndex={1}>{folder.createdAt ? new Date(folder.createdAt).toLocaleDateString() : ''}</Text>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        </VStack>
      </Container>

      {/* Folder Modal */}
      <Modal isOpen={isFolderOpen} onClose={onFolderClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Folder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input value={folderName} onChange={e => setFolderName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Color</FormLabel>
              <Input type="color" value={folderColor} onChange={e => setFolderColor(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCreateFolder}>Create</Button>
            <Button onClick={onFolderClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Bookmark Modal */}
      <Modal isOpen={isBookmarkOpen} onClose={onBookmarkClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Bookmark</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input value={bookmarkTitle} onChange={e => setBookmarkTitle(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>URL</FormLabel>
              <Input value={bookmarkUrl} onChange={e => setBookmarkUrl(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Folder</FormLabel>
              <Select placeholder="Select folder" value={bookmarkFolder} onChange={e => setBookmarkFolder(e.target.value)}>
                {folders.map(folder => (
                  <option key={folder.id || folder._id} value={folder.id || folder._id}>{folder.name}</option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={handleCreateBookmark}>Add</Button>
            <Button onClick={onBookmarkClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Password Modal */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input value={passwordTitle} onChange={e => setPasswordTitle(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Username</FormLabel>
              <Input value={passwordUsername} onChange={e => setPasswordUsername(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={passwordValue} onChange={e => setPasswordValue(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>URL</FormLabel>
              <Input value={passwordUrl} onChange={e => setPasswordUrl(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Notes</FormLabel>
              <Textarea value={passwordNotes} onChange={e => setPasswordNotes(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Master Password (for encryption)</FormLabel>
              <Input type="password" value={masterPassword} onChange={e => setMasterPassword(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePassword}>Save</Button>
            <Button onClick={onPasswordClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Folder Modal to show bookmarks in the selected folder */}
      <Modal isOpen={isFolderModalOpen} onClose={handleCloseFolderModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Folder size={28} color={selectedFolder?.color || '#6B46C1'} />
              <Text>{selectedFolder?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {folderBookmarks.length === 0 ? (
              <Text color="gray.500">No bookmarks in this folder yet.</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {folderBookmarks.map(bookmark => (
                  <MotionBox
                    key={bookmark.id || bookmark._id}
                    whileHover={{ scale: 1.03, boxShadow: '0 0 10px 2px #805ad5' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    bg="white"
                    borderRadius="md"
                    p={4}
                    boxShadow="md"
                    borderWidth={1}
                    borderColor="gray.200"
                  >
                    <HStack spacing={3}>
                      <Bookmark size={20} color="#6B46C1" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{bookmark.title}</Text>
                        <Text fontSize="sm" color="gray.500">{bookmark.url}</Text>
                      </VStack>
                    </HStack>
                  </MotionBox>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseFolderModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;