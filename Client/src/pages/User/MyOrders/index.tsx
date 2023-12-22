import {
    AbsoluteCenter,
    Box,
    Button,
    Card,
    Heading,
    Skeleton,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import { useOrders } from '../../../hooks/queries/useOrders.ts';
import { formatPrice } from '../../../utilities/formatPrice.ts';
import { Link as ReactRouterLink } from 'react-router-dom';

const MyOrdersPage = () => {
    const { data, isError, isLoading } = useOrders();

    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            <Card variant="outline" px={{ base: '4', md: '8', lg: '12' }} py={{ base: '6', md: '8', lg: '10' }}>
                <Stack spacing={{ base: '8', md: '10' }}>
                    <Heading fontSize="2xl" fontWeight="extrabold">
                        My orders
                    </Heading>
                    {isLoading && (
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th fontSize={16}>Order Id</Th>
                                        <Th fontSize={16}>Ordered On</Th>
                                        <Th fontSize={16}>Total Amount</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {Array(3)
                                        .fill('*')
                                        .map((_, index) => (
                                            <Tr key={index}>
                                                <Td>
                                                    <Skeleton height="20px" />
                                                </Td>
                                                <Td>
                                                    <Skeleton height="20px" />
                                                </Td>
                                                <Td>
                                                    <Skeleton height="20px" />
                                                </Td>
                                            </Tr>
                                        ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    )}
                    {isError && (
                        <Box minHeight="50vh" position="relative">
                            <AbsoluteCenter axis="both">
                                <p>Error loading orders.</p>
                            </AbsoluteCenter>
                        </Box>
                    )}
                    {Array.isArray(data) &&
                        (data.length === 0 ? (
                            <VStack spacing={6} minHeight="50vh">
                                <Text>No orders found. Start shopping to see your order history!</Text>
                                <Button variant="solid" colorScheme="blue" as={ReactRouterLink} to="/catalog">
                                    Start shopping
                                </Button>
                            </VStack>
                        ) : (
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th fontSize={16}>Order Id</Th>
                                            <Th fontSize={16}>Ordered On</Th>
                                            <Th fontSize={16}>Total Amount</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data.map((item) => (
                                            <Tr key={item.id}>
                                                <Td>{item.id}</Td>
                                                <Td>
                                                    {new Date(item.createdAt)
                                                        .toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })
                                                        .split(', ')
                                                        .slice(1)
                                                        .join(', ')}
                                                </Td>
                                                <Td>{formatPrice(item.total)}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        ))}
                </Stack>
            </Card>
        </Box>
    );
};

export default MyOrdersPage;
