import { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Text,
  Input,
  Spinner,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Button,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdCancel, MdLocationOn, MdFilterList } from 'react-icons/md';
import { filterData, getFilterValues } from '../utils/filterData';
import { baseUrl, fetchApi } from '../utils/fetchApi';

export default function SearchFilters() {
  const [filters] = useState(filterData);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const toggleFilters = () => setShowFilters(!showFilters);

  const searchProperties = (filterValues) => {
    const path = router.pathname;
    const { query } = router;

    const values = getFilterValues(filterValues);

    values.forEach((item) => {
      if (item.value && filterValues?.[item.name]) {
        query[item.name] = item.value;
      }
    });

    router.push({ pathname: path, query: query });
  };

  useEffect(() => {
    if (searchTerm !== '') {
      const fetchData = async () => {
        setLoading(true);
        const data = await fetchApi(`${baseUrl}/auto-complete?query=${searchTerm}`);
        setLocationData(data?.hits);
        setLoading(false);
      };

      fetchData();
    } else {
      setLocationData([]);
    }
  }, [searchTerm]);

  return (
    <Box bg="white" p="4" boxShadow="md" borderRadius="md" marginBottom="5">
      {/* Location Search */}
      <InputGroup marginBottom="4">
        <InputLeftElement pointerEvents="none">
          <Icon as={MdLocationOn} color="gray.500" />
        </InputLeftElement>
        <Input
          placeholder="Search by location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          borderColor="gray.300"
          focusBorderColor="teal.500"
        />
        {searchTerm !== '' && (
          <InputRightElement>
            <Icon
              as={MdCancel}
              color="gray.500"
              cursor="pointer"
              onClick={() => {
                setSearchTerm('');
                setLocationData([]);
              }}
            />
          </InputRightElement>
        )}
      </InputGroup>

      {/* Location Suggestions */}
      {searchTerm !== '' && (
        <Box
          position="relative"
          maxHeight="200px"
          overflowY="auto"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          marginBottom="4"
        >
          {loading && (
            <Flex justifyContent="center" alignItems="center" p="2">
              <Spinner />
            </Flex>
          )}
          {locationData?.map((location) => (
            <Box
              key={location.id}
              onClick={() => {
                searchProperties({ locationExternalIDs: location.externalID });
                setSearchTerm(location.name);
                setLocationData([]);
              }}
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              p="2"
            >
              <Text>{location.name}</Text>
            </Box>
          ))}
          {!loading && searchTerm !== '' && locationData?.length === 0 && (
            <Box p="2">
              <Text>No results found</Text>
            </Box>
          )}
        </Box>
      )}

      {/* Toggle Filters Button */}
      <Button
        onClick={toggleFilters}
        leftIcon={<MdFilterList />}
        colorScheme="teal"
        variant="outline"
        width="100%"
        marginBottom="4"
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>

      {/* Filters */}
      <Collapse in={showFilters} animateOpacity>
        <Flex flexWrap="wrap" justifyContent="space-between">
          {filters?.map((filter) => (
            <Box key={filter.queryName} flexBasis={['100%', '48%', '31%']} marginBottom="4">
              <Text fontWeight="medium" marginBottom="2">
                {filter.placeholder}
              </Text>
              <Select
                placeholder={`Select ${filter.placeholder.toLowerCase()}`}
                onChange={(e) => searchProperties({ [filter.queryName]: e.target.value })}
                borderColor="gray.300"
                focusBorderColor="teal.500"
              >
                {filter?.items?.map((item) => (
                  <option value={item.value} key={item.value}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </Box>
          ))}
        </Flex>
      </Collapse>
    </Box>
  );
}
