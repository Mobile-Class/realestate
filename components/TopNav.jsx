import { Flex, Button, Box } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TopNav = () => {
  const router = useRouter();

  // Function to determine if the route is active
  const isActive = (path) => router.pathname === path;

  return (
    <Flex justifyContent="center" p="4" borderBottom="1px" borderColor="gray.200">
      <Link href="/" passHref>
        <Box
          as="button"
          fontWeight={isActive('/') ? 'bold' : 'normal'}
          px="4"
          py="2"
          borderBottom={isActive('/') ? '2px solid blue' : '2px solid transparent'}
          _hover={{ borderBottom: '2px solid blue', cursor: 'pointer' }}
          m="2"
        >
          Home
        </Box>
      </Link>
      <Link href="/search" passHref>
        <Box
          as="button"
          fontWeight={isActive('/search') ? 'bold' : 'normal'}
          px="4"
          py="2"
          borderBottom={isActive('/search') ? '2px solid blue' : '2px solid transparent'}
          _hover={{ borderBottom: '2px solid blue', cursor: 'pointer' }}
          m="2"
        >
          Search
        </Box>
      </Link>
      <Link href="/search?purpose=for-sale" passHref>
        <Box
          as="button"
          fontWeight={isActive('/search?purpose=for-sale') ? 'bold' : 'normal'}
          px="4"
          py="2"
          borderBottom={isActive('/search?purpose=for-sale') ? '2px solid blue' : '2px solid transparent'}
          _hover={{ borderBottom: '2px solid blue', cursor: 'pointer' }}
          m="2"
        >
          Buy Property
        </Box>
      </Link>
      <Link href="/search?purpose=for-rent" passHref>
        <Box
          as="button"
          fontWeight={isActive('/search?purpose=for-rent') ? 'bold' : 'normal'}
          px="4"
          py="2"
          borderBottom={isActive('/search?purpose=for-rent') ? '2px solid blue' : '2px solid transparent'}
          _hover={{ borderBottom: '2px solid blue', cursor: 'pointer' }}
          m="2"
        >
          Rent Property
        </Box>
      </Link>
      <Link href="/market-trends" passHref>
        <Box
          as="button"
          fontWeight={isActive('/market-trends') ? 'bold' : 'normal'}
          px="4"
          py="2"
          borderBottom={isActive('/market-trends') ? '2px solid blue' : '2px solid transparent'}
          _hover={{ borderBottom: '2px solid blue', cursor: 'pointer' }}
          m="2"
        >
          Market Trends
        </Box>
      </Link>
    </Flex>
  );
};

export default TopNav;
