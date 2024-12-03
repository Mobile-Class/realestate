  import { useState, useEffect } from 'react';
  import { Box, Text, Flex, Grid, Divider, Image, Table, Tbody, Tr, Td, Thead, Th, Button } from '@chakra-ui/react';
  import { useRouter } from 'next/router';
  import { baseUrl, fetchApi } from '../../utils/fetchApi';
  import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
  import { FaHome, FaMoneyBill, FaWallet, FaPercent, FaChartLine, FaUsers } from 'react-icons/fa'; 
  import dynamic from "next/dynamic";
  const MapComponent = dynamic(() => import("../../components/MapComponent"), {
    ssr: false,
  });

  const ExecutiveSummary = ({ property }) => {
    const router = useRouter();
    const {
      id,
      title,
      description,
      price,
      area,
      purpose,
      type,
      agency,
      rooms,
      baths,
      geography,
      coverPhoto,
    } = property || {};  // Handle the case when 'property' is undefined or null.

    // Mock financial data (Replace with real data if available)
    const financialData = {
      purchasePrice: price || 530000000,
      downPayment: (price || 530000000) * 0.2,
      loanAmount: (price || 530000000) * 0.8,
      interestRate: 3.5,
      loanTerm: 30,
      grossRentalIncome: 40000000,
      operatingExpenses: 10000000,
      vacancyRate: 5,
      appreciationRate: 2,
      resaleHoldingPeriod: 10,
    };

    // Function to generate cash flow data
    const generateCashFlowData = (data) => {
      const {
        purchasePrice,
        downPayment,
        loanAmount,
        interestRate,
        loanTerm,
        grossRentalIncome,
        operatingExpenses,
        vacancyRate,
        appreciationRate,
        resaleHoldingPeriod,
      } = data;

      const annualInterestRate = interestRate / 100;
      const monthlyInterestRate = annualInterestRate / 12;
      const totalPayments = loanTerm * 12;
      const monthlyPayment =
        (loanAmount * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
      const annualDebtService = monthlyPayment * 12;

      let cashFlowData = [];

      for (let year = 1; year <= resaleHoldingPeriod; year++) {
        const vacancyLoss = (grossRentalIncome * vacancyRate) / 100;
        const netOperatingIncome = grossRentalIncome - vacancyLoss - operatingExpenses;
        const cashFlow = netOperatingIncome - annualDebtService;

        const propertyValue =
          purchasePrice * Math.pow(1 + appreciationRate / 100, year);

        cashFlowData.push({
          year,
          netOperatingIncome,
          cashFlow,
          propertyValue,
        });
      }

      return cashFlowData;
    };

    // Generate cash flow data
    const cashFlowData = generateCashFlowData(financialData);

    // Helper function to generate random values within a range
    const generateRandomValue = (baseValue, variance = 0.05) => {
      const min = baseValue * (1 - variance);
      const max = baseValue * (1 + variance);
      return (Math.random() * (max - min) + min).toFixed(2);
    };

    // Exchange rate (USD to AED), assuming it's 1 USD = 3.67 AED (check for up-to-date rate)
    const exchangeRate = 3.67;

    // Base values for each metric
    const financialDataLeft = {
      "Cash on Cash Return": 5.51,  // base value for Cash on Cash Return
      "Internal Rate of Return (IRR)": 15.69,  // base value for IRR
      "Capitalization Rate": 457,  // base value for Capitalization Rate
      "Gross Rent Multiplier (GRM)": 13.89,  // base value for GRM
      "Debt-coverage Ratio (DCR)": 1.35,  // base value for DCR
      "Operating Expense Ratio (OER)": 33.22,  // base value for OER
      "After Repair Value": 150000*exchangeRate,  // base value for After Repair Value
      "Profit/Equity From Rehab": 38000*exchangeRate,  // base value for Profit/Equity From Rehab
    };

    const operatingDataRight = {
      "Rent": 900 * exchangeRate,  // Rent
      "Gross Operating Income (GOI)": 10260 * exchangeRate,  // Gross Operating Income
      "Total Expenses": 3409 * exchangeRate,  // Total Expenses
      "Net Operating Income (NOI)": 6851 * exchangeRate,  // Net Operating Income
      "Annual Debt Service": 5087 * exchangeRate,  // Annual Debt Service
      "Cash Flow Before Taxes (CFBT)": 1764 * exchangeRate,  // Cash Flow Before Taxes
      "Income Tax Liability": 323 * exchangeRate,  // Income Tax Liability
      "Cash Flow After Taxes (CFAT)": 1441 * exchangeRate,  // Cash Flow After Taxes
    };

    return (
      <Box maxWidth="100%" margin="auto" p="6" fontFamily="Arial, sans-serif">
        
        <Box mb="8">
          <Grid templateColumns="repeat(2, 1fr)" gap="6">
            {/* Property Overview */}
            <Box>
              <Box fontSize="2xl" fontWeight="bold" mb="4">
                <Text>{title || 'Not Available'}</Text>
              </Box>

              {/* Condominium */}
              <Box mb="4">
                <Text>Condominium: {`${rooms} bedrooms, ${baths} bathrooms`}</Text>
              </Box>

              {/* Year built */}
              <Box mb="4">
                <Text>Year built: {'2021'}</Text>
              </Box>

              {/* Size */}
              <Box mb="4">
                <Text>Size: {area ? `${area.toFixed(2)} sqft` : 'Not Specified'}</Text>
              </Box>

              {/* Investment strategy */}
              <Box mb="4">
                <Text>Investment strategy: {purpose ? purpose.charAt(0).toUpperCase() + purpose.slice(1) : 'N/A'} - 
                {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'N/A'}</Text>
              </Box>

              {/* Description */}
              <Box mb="4">
                <Text>{'This is a sample rental investment report. It takes approx. 1-2 minutes to generate a report like this thanks to our MLS data loader. The report includes a Cash flow forecast, many real estate metrics and optionally also Sales and Rental comps.'}</Text>
              </Box>
            </Box>

            {/* Property Image */}
            <Box>
              {coverPhoto ? (
                <Box mb="6">
                  <Image
                    src={coverPhoto.url}
                    alt={title || 'Property Image'}
                    width="100%"
                    height="auto"
                    borderRadius="md"
                    objectFit="cover"
                  />
                </Box>
              ) : (
                <Box mb="6">
                  <Text>No image available</Text>
                </Box>
              )}
            </Box>
          </Grid>
        </Box>
        {/* 4 Rectangular Boxes with Icons and Text */}
        <Box mb="8">
          <Grid templateColumns="repeat(4, 1fr)" gap="6">
            {/* Box 1 - Purchase Price */}
            <Box
              bg="#F6E1B3"
              p="4"
              borderRadius="md"
              textAlign="center"
              boxShadow="sm"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box fontSize="3xl" mb="2">
                {/* Icon for Purchase Price */}
                <FaMoneyBill />
                </Box>
              <Text fontSize="lg" fontWeight="bold">
                AED {financialData.purchasePrice.toLocaleString()}
              </Text>
              <Text>Purchase Price</Text>
            </Box>

            {/* Box 2 - Rent */}
            <Box
              bg="#B3E6F2"
              p="4"
              borderRadius="md"
              textAlign="center"
              boxShadow="sm"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box fontSize="3xl" mb="2">
                {/* Icon for Rent */}
                <FaHome />
                </Box>
              <Text fontSize="lg" fontWeight="bold">
                AED {financialData.grossRentalIncome.toLocaleString()}
              </Text>
              <Text>Gross Rental Income</Text>
            </Box>

            {/* Box 3 - Monthly Cash Flow */}
            <Box
              bg="#E1F7D5"
              p="4"
              borderRadius="md"
              textAlign="center"
              boxShadow="sm"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box fontSize="3xl" mb="2">
                {/* Icon for Monthly Cash Flow */}
                <FaWallet />
                </Box>
              <Text fontSize="lg" fontWeight="bold">
                AED {Math.max(financialData.grossRentalIncome - financialData.operatingExpenses - (financialData.loanAmount * financialData.interestRate / 100 / 12), 0).toLocaleString()}
              </Text>
              <Text>Monthly Cash Flow</Text>
            </Box>

            {/* Box 4 - Cash on Cash Return */}
            <Box
              bg="#FFEBB7"
              p="4"
              borderRadius="md"
              textAlign="center"
              boxShadow="sm"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box fontSize="3xl" mb="2">
                {/* Icon for Cash on Cash Return */}
                <FaPercent />
              </Box>
              <Text fontSize="lg" fontWeight="bold">
                {((financialData.grossRentalIncome - financialData.operatingExpenses) / financialData.downPayment * 100).toFixed(2)}%
              </Text>
              <Text>Cash on Cash Return</Text>
            </Box>
          </Grid>
        </Box>

      <Grid templateColumns="repeat(2, 1fr)" gap="6">
        
        {/* Financial Analysis Table */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb="4">Financial Analysis</Text>
          <Table variant="simple">
            <Tbody>
              {Object.entries(financialDataLeft).map(([key, baseValue]) => (
                <Tr key={key}>
                  <Td fontWeight="bold">{key}</Td>
                  <Td>
                    {
                      key === "Cash on Cash Return" 
                        ? `${((financialData.grossRentalIncome - financialData.operatingExpenses) / financialData.downPayment * 100).toFixed(2)}%`
                        : (key === "Internal Rate of Return (IRR)" || key === "Capitalization Rate")
                          ? `${generateRandomValue(baseValue, 0.05)}%`
                          : key === "Gross Rent Multiplier (GRM)"
                            ? generateRandomValue(baseValue, 0.05)
                            : key === "Debt-coverage Ratio (DCR)"
                              ? generateRandomValue(baseValue, 0.05)
                              : key === "Operating Expense Ratio (OER)"
                                ? `${generateRandomValue(baseValue, 0.05)}%`
                                : key === "After Repair Value" || key === "Profit/Equity From Rehab"
                                  ? `AED ${generateRandomValue(baseValue, 0.1)}`
                                  : baseValue
                    }
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Operating Analysis Table on the Right */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb="4">Operating Analysis</Text>
          <Table variant="simple">
            <Tbody>
              {Object.entries(operatingDataRight).map(([key, baseValue]) => (
                <Tr key={key}>
                  <Td fontWeight="bold">{key}</Td>
                  <Td>
                    {
                      key === "Rent" 
                        ? `AED ${financialData.grossRentalIncome.toLocaleString()}` 
                        : (key === "Gross Operating Income (GOI)" || key === "Total Expenses" ||
                          key === "Net Operating Income (NOI)" || key === "Annual Debt Service" || 
                          key === "Cash Flow Before Taxes (CFBT)" || key === "Income Tax Liability" || 
                          key === "Cash Flow After Taxes (CFAT)")
                          ? `AED ${generateRandomValue(baseValue, 0.05)}`
                          : baseValue
                    }
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

      </Grid>

      {/* Overview Section
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Property Overview
        </Text>
        <Divider mb="4" />
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Price:</Td>
              <Td>{price ? `AED ${price.toLocaleString()}` : 'Contact for Price'}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Area:</Td>
              <Td>{area ? `${area.toFixed(2)} sqft` : 'Not Specified'}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Rooms:</Td>
              <Td>{rooms || 'N/A'}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Baths:</Td>
              <Td>{baths || 'N/A'}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Purpose:</Td>
              <Td>{purpose ? purpose.charAt(0).toUpperCase() + purpose.slice(1) : 'N/A'}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Type:</Td>
              <Td>{type ? type.charAt(0).toUpperCase() + type.slice(1) : 'N/A'}</Td>
            </Tr>
            {geography && (
              <Tr>
                <Td fontWeight="bold">Location:</Td>
                <Td>
                  Lat: {geography.lat}, Lng: {geography.lng}
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box> */}

      {/* Description Section
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Description
        </Text>
        <Divider mb="4" />
        <Text lineHeight="1.8" color="gray.600">
          {description || 'No description available.'}
        </Text>
      </Box> */}
      
      <Grid templateColumns="repeat(2, 1fr)" gap="6"   mt={{ base: "4", md: "8", lg: "12" }}  // Responsive margin-top
      >

{/* Financial Breakdown */}
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Financial Breakdown
        </Text>
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Purchase Price:</Td>
              <Td>AED {financialData.purchasePrice.toLocaleString()}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Down Payment (20%):</Td>
              <Td>AED {financialData.downPayment.toLocaleString()}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Loan Amount (80%):</Td>
              <Td>AED {financialData.loanAmount.toLocaleString()}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Interest Rate:</Td>
              <Td>{financialData.interestRate}%</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Loan Term:</Td>
              <Td>{financialData.loanTerm} years</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

        
      {/* Cash Flow Chart */}
      <Box mb="12">
        <Text fontSize="2xl" fontWeight="bold" mb="4">Cash Flow Chart</Text>
        <LineChart width={600} height={300} data={cashFlowData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="grossOperatingIncome" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="netOperatingIncome" stroke="#82ca9d" />
          <Line type="monotone" dataKey="cashFlow" stroke="#ff7300" />
        </LineChart>
      </Box>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)"    >
      <Box mb="8">
      <Text fontSize="2xl" fontWeight="bold" mb="4">Cash Flow Chart</Text>

        <Text lineHeight="1.8" color="gray.600">
          {description || 'No description available.'}
        </Text>
      </Box>

        {/* Location Map */}
      {geography && geography.lat && geography.lng && (
        <Box mb="8" >
      <Text fontSize="2xl" fontWeight="bold" mb="4">Location</Text>

          
          <MapComponent center={[geography.lat, geography.lng]} title={title} />
        </Box>
      )}
      </Grid>

      {/* Back Button
      <Button colorScheme="blue" onClick={() => router.push(`/property/${id}`)}>
        Back to Property Details
      </Button> */}
    </Box>
  );
};

export async function getServerSideProps({ params: { id } }) {
  try {
    const data = await fetchApi(`${baseUrl}/properties/detail?externalID=${id}`);
    
    if (!data) {
      return {
        notFound: true, 
      };
    }

    return {
      props: {
        property: data,
      },
    };
  } catch (error) {
    console.error("Error fetching property data:", error);
    return {
      notFound: true, 
    };
  }
}

export default ExecutiveSummary;
