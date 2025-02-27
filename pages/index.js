import Link from 'next/link';
import Image from 'next/image';
import { Flex, Box, Text, Button } from '@chakra-ui/react';

import Property from '../components/Property';
import { baseUrl, fetchApi } from '../utils/fetchApi';


export const Banner = ({ purpose, title1, title2, desc1, desc2, desc3, imageUrl }) => (
  <Flex flexWrap='wrap' justifyContent='center' alignItems='center' m='10'>
    <Image src={imageUrl} width={700} height={500} />
    <Box p='5'>
      <Text color='gray.500' fontSize='sm' fontWeight='medium'>{purpose}</Text>
      <Text fontSize='3xl' fontWeight='bold'>{title1}<br />{title2}</Text>
      <Text fontSize='lg' paddingTop='3' paddingBottom='3' color='gray.700'>{desc1}<br />{desc2}<br />{desc3}</Text>
    </Box>
  </Flex>
);

const Home = ({ propertiesForSale, propertiesForRent }) => {
  //const { saveMouseData } = useMouseTracker(); // Use the custom hook

  return (
    <Box>
      <Banner
        purpose='HOME'
        title1='Find Your'
        title2='Dream Home'
        desc1=' Explore our curated selection of exquisite '
        desc2='properties meticulously tailored to your'
        desc3='unique dream home vision'
        imageUrl='/images/hero.png'
      />
      <Flex flexWrap='wrap'>
        {propertiesForRent.map((property) => (
          <Property property={property} key={property.id} />
        ))}
      </Flex>
    </Box>
  );
};

export async function getStaticProps() {
  const propertyForSale = await fetchApi(
    `${baseUrl}/properties/list?locationExternalIDs=5002&purpose=for-sale&hitsPerPage=6`
  );
  const propertyForRent = await fetchApi(
    `${baseUrl}/properties/list?locationExternalIDs=5002&purpose=for-rent&hitsPerPage=6`
  );

  return {
    props: {
      propertiesForSale: propertyForSale?.hits,
      propertiesForRent: propertyForRent?.hits,
    },
  };
}

export default Home;
