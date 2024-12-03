import { Box, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const MarketTrends = () => {
  // Data for price chart (AED)
  const priceData = {
    labels: ['Dubai Marina', 'Downtown Dubai', 'Business Bay', 'Palm Jumeirah', 'Jumeirah Village Circle'],
    datasets: [
      {
        label: 'Price (AED)',
        data: [1_200_000, 1_500_000, 900_000, 3_000_000, 800_000],  // Example property prices in AED
        borderColor: '#FF6347',
        backgroundColor: 'rgba(255, 99, 71, 0.2)',
        fill: true,
      },
    ],
  };

  // Data for price per sqft chart (AED per sqft)
  const pricePerSqftData = {
    labels: ['Dubai Marina', 'Downtown Dubai', 'Business Bay', 'Palm Jumeirah', 'Jumeirah Village Circle'],
    datasets: [
      {
        label: 'Price per sqft (AED)',
        data: [1500, 1800, 1200, 3500, 1000], // Example price per sqft in AED
        borderColor: '#1E90FF',
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart options for both price and price per sqft
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Dubai Property Price Change',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `AED ${tooltipItem.raw}`, // Customize the tooltip to show the price
        },
      },
    },
  };

  // Data for the sales volume chart
  const salesVolumeData = {
    labels: ['Dubai Marina', 'Downtown Dubai', 'Business Bay', 'Palm Jumeirah', 'Jumeirah Village Circle'],
    datasets: [
      {
        label: 'Sales Volume (Units Sold)',
        data: [150, 180, 120, 90, 75],  // Example sales volume data for each area
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      },
    ],
  };

  // Chart options for sales volume
  const salesVolumeOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales Volume by Area in Dubai (2024)',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} properties sold`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Area',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Units Sold',
        },
        beginAtZero: true,
      },
    },
  };

  // Data for property price change by area chart
  const priceChangeData = {
    labels: ['Dubai Marina', 'Downtown Dubai', 'Business Bay', 'Palm Jumeirah', 'Jumeirah Village Circle'],
    datasets: [
      {
        label: 'Price Change (%)',
        data: [5, 7, 4, 3, 6],  // Example price change in percentage for each area
        backgroundColor: '#FF9800',  // Color for the bars
        borderColor: '#F57C00',
        borderWidth: 1,
      },
    ],
  };

  // Chart options for property price change by area
  const priceChangeOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Property Price Change by Area in Dubai (2024)',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}% change`,  // Showing percentage change in the tooltip
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Area',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price Change (%)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box maxWidth="1280px" m="auto" p="4">
      {/* Market Overview Section */}
      <Heading as="h1" size="xl" mb="4" textAlign="center" color="teal.500">
        Market Trends: Dubai Real Estate
      </Heading>
      <Text fontSize="lg" mb="8" textAlign="center" color="gray.600">
        Stay up-to-date with the latest trends and insights into Dubai's booming real estate market. From rising property values to the top areas for investment, we provide you with detailed data and analysis to make informed decisions whether you are buying, renting, or investing in Dubai properties.
      </Text>

      {/* Property Price Change Chart Section */}
      <Box mb="8" p="4" borderRadius="lg" border="1px" borderColor="gray.200">
        <Heading as="h2" size="lg" mb="4" color="teal.600">
          Property Price Change by Area
        </Heading>
        <Text fontSize="md" mb="4" color="gray.600">
          The following chart illustrates the change in property prices across different areas of Dubai. You can choose to view the price in AED or price per square foot.
        </Text>

        {/* Tabs for selecting between "Price" and "Price per sqft" */}
        <Tabs isFitted variant="enclosed">
          <TabList>
            <Tab>Price</Tab>
            <Tab>Price per sqft</Tab>
          </TabList>

          <TabPanels>
            {/* Price Tab Panel */}
            <TabPanel>
              <Line data={priceData} options={chartOptions} />
            </TabPanel>

            {/* Price per sqft Tab Panel */}
            <TabPanel>
              <Line data={pricePerSqftData} options={chartOptions} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Sales Volume Chart Section */}
      <Box mb="8" p="4" borderRadius="lg" border="1px" borderColor="gray.200">
        <Heading as="h2" size="lg" mb="4" color="teal.600">
          Sales Volume by Area
        </Heading>
        <Text fontSize="md" mb="4" color="gray.600">
          The sales volume reflects the number of properties sold in various areas of Dubai during 2024. The data indicates strong sales in popular and prime locations like Dubai Marina and Downtown Dubai.
        </Text>
        <Bar data={salesVolumeData} options={salesVolumeOptions} />
      </Box>

      {/* Property Price Change by Area Section */}
      <Box mb="8" p="4" borderRadius="lg" border="1px" borderColor="gray.200">
        <Heading as="h2" size="lg" mb="4" color="teal.600">
          Property Price Change by Area
        </Heading>
        <Text fontSize="md" mb="4" color="gray.600">
          The following chart illustrates the percentage change in property prices across different areas of Dubai. It reflects the current market trends and highlights areas with the highest growth.
        </Text>
        <Bar data={priceChangeData} options={priceChangeOptions} />
      </Box>

      {/* Additional Insights Section */}
      <Box mt="8" p="4" borderRadius="lg" border="1px" borderColor="gray.200">
        <Heading as="h2" size="lg" mb="4" color="teal.600">
          AI Innovations & PropTech in Dubai Real Estate
        </Heading>
        <Text fontSize="md" mb="4" color="gray.600">
          Investment in Dubai’s property market reached a staggering $100 billion last year, with this figure expected to grow by 5% in 2024, according to the latest data.
        </Text>
        <Text fontSize="md" mb="4" color="gray.600">
          The combination of innovation is reforming how properties are purchased and experienced. Features such as virtual visits, 3D floor plans, and AI-driven market analysis are offering clients the exceptional ability to visualize both built and off-plan properties.
        </Text>
        <Text fontSize="md" mb="4" color="gray.600">
          The drive for greater accessibility in property ownership is increasing, with developers now offering flexible, customized financing options.
        </Text>
      </Box>
    </Box>
  );
};

export default MarketTrends;
