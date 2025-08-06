import React from 'react';
import {
  Box,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

const MotionBox = motion(Box);

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  index,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <MotionBox
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Box
        p={6}
        bg={cardBg}
        rounded="2xl"
        border="1px solid"
        borderColor={borderColor}
        shadow="sm"
        _hover={{ shadow: 'lg' }}
        transition="all 0.2s"
        position="relative"
        overflow="hidden"
      >
        {/* Background gradient */}
        <Box
          position="absolute"
          top={0}
          right={0}
          w="100px"
          h="100px"
          bgGradient={`radial(circle, ${color}20, transparent)`}
          opacity={0.3}
        />

        <Stat>
          <StatLabel color="gray.500" fontSize="sm" fontWeight="medium">
            <Icon as={icon} mr={2} color={color} />
            {title}
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color={color}>
            {value}
          </StatNumber>
          {subtitle && (
            <StatHelpText fontSize="sm" color="gray.500" mb={0}>
              {subtitle}
            </StatHelpText>
          )}
        </Stat>
      </Box>
    </MotionBox>
  );
};

export default StatsCard;