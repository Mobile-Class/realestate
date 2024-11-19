import { useState, useEffect } from 'react';
import { Box, Text, Flex, Divider, Image, Table, Tbody, Tr, Td, Thead, Th, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { baseUrl, fetchApi } from '../../utils/fetchApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
  } = property;

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

  return (
    <Box maxWidth="1000px" margin="auto" p="6" fontFamily="Arial, sans-serif">
      {/* Title Section */}
      <Box textAlign="center" mb="6">
        <Text fontSize="3xl" fontWeight="bold" mb="2">
          {title}
        </Text>
        <Text color="gray.600" fontSize="lg">
          {purpose.charAt(0).toUpperCase() + purpose.slice(1)} - {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
      </Box>

      {/* Property Image */}
      {coverPhoto && (
        <Box mb="6">
          <Image
            src={coverPhoto.url}
            alt={title}
            width="100%"
            height="auto"
            borderRadius="md"
            objectFit="cover"
          />
        </Box>
      )}

      {/* Overview Section */}
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Property Overview
        </Text>
        <Divider mb="4" />
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Price:</Td>
              <Td>AED {price ? price.toLocaleString() : 'Contact for Price'}</Td>
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
              <Td>{purpose.charAt(0).toUpperCase() + purpose.slice(1)}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Type:</Td>
              <Td>{type.charAt(0).toUpperCase() + type.slice(1)}</Td>
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
      </Box>

      {/* Description Section */}
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Description
        </Text>
        <Divider mb="4" />
        <Text lineHeight="1.8" color="gray.600">
          {description}
        </Text>
      </Box>

      {/* Financial Breakdown */}
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Financial Breakdown
        </Text>
        <Divider mb="4" />
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

      {/* Operating Analysis */}
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Operating Analysis
        </Text>
        <Divider mb="4" />
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Gross Rental Income:</Td>
              <Td>AED {financialData.grossRentalIncome.toLocaleString()}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Vacancy Loss ({financialData.vacancyRate}%):</Td>
              <Td>
                AED {((financialData.grossRentalIncome * financialData.vacancyRate) / 100).toLocaleString()}
              </Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Operating Expenses:</Td>
              <Td>AED {financialData.operatingExpenses.toLocaleString()}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Net Operating Income:</Td>
              <Td>
                AED
                {(
                  financialData.grossRentalIncome -
                  (financialData.grossRentalIncome * financialData.vacancyRate) / 100 -
                  financialData.operatingExpenses
                ).toLocaleString()}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      {/* Cash Flow Forecast */}
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Long-term Cash Flow Forecast
        </Text>
        <Divider mb="4" />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Year</Th>
              <Th>NOI (AED)</Th>
              <Th>Cash Flow (AED)</Th>
              <Th>Property Value (AED)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cashFlowData.map((item) => (
              <Tr key={item.year}>
                <Td>{item.year}</Td>
                <Td>{item.netOperatingIncome.toLocaleString()}</Td>
                <Td>{item.cashFlow.toLocaleString()}</Td>
                <Td>{item.propertyValue.toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Cash Flow Chart */}
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Cash Flow & Property Value Over Time
        </Text>
        <Divider mb="4" />
        <LineChart
          width={800}
          height={400}
          data={cashFlowData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cashFlow" stroke="#8884d8" name="Cash Flow" />
          <Line type="monotone" dataKey="propertyValue" stroke="#82ca9d" name="Property Value" />
        </LineChart>
      </Box>

      {/* Resale Analysis */}
      <Box mb="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Resale Analysis
        </Text>
        <Divider mb="4" />
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td fontWeight="bold">
                Estimated Property Value after {financialData.resaleHoldingPeriod} years:
              </Td>
              <Td>
                AED{' '}
                {(
                  financialData.purchasePrice *
                  Math.pow(1 + financialData.appreciationRate / 100, financialData.resaleHoldingPeriod)
                ).toLocaleString()}
              </Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Total Equity Gain:</Td>
              <Td>
                AED{' '}
                {(
                  financialData.purchasePrice *
                    Math.pow(1 + financialData.appreciationRate / 100, financialData.resaleHoldingPeriod) -
                  financialData.loanAmount -
                  financialData.downPayment
                ).toLocaleString()}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      {/* Agency Information */}
      {agency && (
        <Box mt="8">
          <Text fontSize="2xl" fontWeight="bold" mb="4">
            Listed By
          </Text>
          <Divider mb="4" />
          <Flex alignItems="center">
            <Image
              src={agency.logo.url}
              alt={agency.name}
              boxSize="50px"
              borderRadius="full"
              objectFit="cover"
              mr="4"
            />
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {agency.name}
              </Text>
              <Text color="gray.600" fontSize="sm">
                License: {agency.licenses.map((license) => license.number).join(', ')}
              </Text>
            </Box>
          </Flex>
        </Box>
      )}

      {/* Back to Property Details Button */}
      <Box textAlign="center" mt="8">
        <Button colorScheme="blue" onClick={() => router.push(`/property/${id}`)}>
          Back to Property Details
        </Button>
      </Box>
    </Box>
  );
};

export default ExecutiveSummary;

export async function getServerSideProps({ params: { id } }) {
  const data = await fetchApi(`${baseUrl}/properties/detail?externalID=${id}`);

  return {
    props: {
      property: data,
    },
  };
}
