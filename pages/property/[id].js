import {
  Box,
  Flex,
  Spacer,
  Text,
  Grid,
  GridItem,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { FaBed, FaBath } from "react-icons/fa";
import { BsGridFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import millify from "millify";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

import "slick-carousel/slick/slick-theme.css";

import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
});

import "leaflet/dist/leaflet.css";

import { baseUrl, fetchApi } from "../../utils/fetchApi";
import { useRouter } from "next/router"; // Import useRouter

const PropertyDetails = ({
  propertyDetails: {
    price,
    rentFrequency,
    rooms,
    title,
    baths,
    area,
    agency,
    isVerified,
    description,
    type,
    purpose,
    furnishingStatus,
    amenities,
    photos = [],
    geography,
    id,
  },
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For modal control
  const router = useRouter(); // Initialize useRouter

  const handleInvestmentClick = () => {
    // Navigate to the investment page
    router.push(`/investment/${id}`); // Pass the property ID as a query parameter or handle as needed
  };

  return (
    <Box maxWidth="1000px" margin="auto" p="4">
      {/* Photo Grid */}
      {photos.length > 0 && (
        <Box marginBottom="6" position="relative">
          <Grid
            templateAreas={`"main main side1 side2"
                            "main main side3 side4"`}
            gridTemplateRows="repeat(2, 1fr)"
            gridTemplateColumns="repeat(4, 1fr)"
            gap="4"
          >
            <GridItem
              area="main"
              overflow="hidden"
              borderRadius="10px"
              boxShadow="lg"
            >
              <Image
                src={photos[0]?.url}
                alt="Main Property Image"
                objectFit="cover"
                width="100%"
                height="100%"
              />
            </GridItem>

            {photos.slice(1, 5).map((photo, index) => (
              <GridItem
                key={index}
                area={`side${index + 1}`}
                overflow="hidden"
                borderRadius="10px"
                boxShadow="lg"
                position="relative"
              >
                <Image
                  src={photo.url}
                  alt={`Property Image ${index + 1}`}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
                {index === 3 && photos.length > 5 && (
                  <Button
                    position="absolute"
                    bottom="2"
                    right="2"
                    color="black"
                    bg="white"
                    border="1px solid black"
                    borderRadius="md"
                    fontWeight="medium"
                    fontSize="sm"
                    paddingX="4"
                    paddingY="2"
                    leftIcon={<BsGridFill />}
                    onClick={onOpen} // Open the modal
                    zIndex="1"
                    _hover={{ bg: "gray.100" }}
                    _active={{ bg: "gray.200" }}
                  >
                    Show all photos
                  </Button>
                )}
              </GridItem>
            ))}
          </Grid>
        </Box>
      )}

      {/* Modal for All Photos */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All Photos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={true}
            >
              {photos.map((photo, index) => (
                <Box key={index}>
                  <Image
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    width="100%"
                    height="auto"
                    objectFit="contain"
                    borderRadius="md"
                    boxShadow="lg"
                  />
                </Box>
              ))}
            </Slider>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Property Details */}
      <Box w="full" p="6">
        <Flex paddingTop="2" alignItems="center">
          <Box paddingRight="3" color="green.400">
            {isVerified && <GoVerified />}
          </Box>
          <Text fontWeight="bold" fontSize="lg">
            AED {price} {rentFrequency && `/${rentFrequency}`}
          </Text>
          <Spacer />
          <Avatar size="sm" src={agency?.logo?.url}></Avatar>
        </Flex>
        <Flex
          alignItems="center"
          p="1"
          justifyContent="space-between"
          w="250px"
          color="blue.400"
        >
          {rooms} <FaBed /> | {baths} <FaBath /> | {millify(area)} sqft{" "}
          <BsGridFill />
        </Flex>
      </Box>

      {/* Description and Buttons */}
      <Flex mt="4" gap="4">
        {/* Description */}
        <Box flex="4" borderRight="1px" borderColor="gray.200" pr="4">
          <Text fontSize="lg" fontWeight="bold" mb="2">
            {title}
          </Text>
          <Text
            lineHeight="1.6"
            color="gray.600"
            noOfLines={showFullDescription ? undefined : 4}
          >
            {description}
          </Text>
          <Button
            mt="2"
            size="sm"
            variant="link"
            colorScheme="blue"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "Show Less" : "Show More"}
          </Button>
        </Box>

        {/* Buttons */}
        <Box flex="2" display="flex" flexDirection="column" gap="4">
          <Button
            colorScheme="teal"
            size="lg"
            fontWeight="bold"
            borderRadius="full"
            onClick={handleInvestmentClick} // Navigate to investment page
            boxShadow="lg"
            _hover={{ bg: "teal.400" }}
            _active={{ bg: "teal.500", transform: "scale(0.95)" }}
          >
            Explore Investment Opportunity
          </Button>
          <Button
            colorScheme="gray"
            size="lg"
            fontWeight="bold"
            borderRadius="full"
            onClick={() => alert("Property saved!")} // Replace with save functionality
            boxShadow="lg"
            _hover={{ bg: "gray.300" }}
            _active={{ bg: "gray.400", transform: "scale(0.95)" }}
          >
            Save Property
          </Button>
        </Box>
      </Flex>

      {/* Amenities */}
      <Box mt="5">
        {amenities.length > 0 && (
          <Text fontSize="2xl" fontWeight="black" marginBottom="3">
            Facilities:
          </Text>
        )}
        <Flex flexWrap="wrap">
          {amenities?.map((item) =>
            item?.amenities?.map((amenity) => (
              <Text
                key={amenity.text}
                fontWeight="bold"
                color="blue.400"
                fontSize="l"
                p="2"
                bg="gray.200"
                m="1"
                borderRadius="5"
              >
                {amenity.text}
              </Text>
            ))
          )}
        </Flex>
      </Box>

      {/* Location Map */}
      {geography && geography.lat && geography.lng && (
        <Box marginTop="5">
          <Text fontSize="2xl" fontWeight="black">
            Location:
          </Text>
          <MapComponent center={[geography.lat, geography.lng]} title={title} />
        </Box>
      )}
    </Box>
  );
};

export default PropertyDetails;

// Fetch property details on the server side
export async function getServerSideProps({ params: { id } }) {
  const data = await fetchApi(`${baseUrl}/properties/detail?externalID=${id}`);

  return {
    props: {
      propertyDetails: data,
    },
  };
}
