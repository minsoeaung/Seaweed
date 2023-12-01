import {
    AbsoluteCenter,
    Box,
    Button,
    Card,
    Flex,
    Heading,
    HStack,
    Link,
    Stack,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { useCart } from '../../../hooks/queries/useCart.ts';
import { CartItem } from './CartItem.tsx';
import { CartOrderSummary } from './CartOrderSummary.tsx';
import { Link as ReactRouterLink } from 'react-router-dom';
import AntdSpin from '../../../components/AntdSpin';
import { Fallback } from '../../../components/Fallback';
import { ErrorDisplay } from '../../../components/ErrorDisplay.tsx';
import { ApiError } from '../../../types/apiError.ts';

const CartPage = () => {
    const { isLoading, isFetching, data, isError, error } = useCart();

    if (isError) {
        return <ErrorDisplay error={error as unknown as ApiError} />;
    }

    if (isLoading) {
        return (
            <AbsoluteCenter axis="both">
                <AntdSpin />
            </AbsoluteCenter>
        );
    }

    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            {isFetching && <Fallback />}
            {data && (
                <Card variant="outline" px={{ base: '4', md: '8', lg: '12' }} py={{ base: '6', md: '8', lg: '10' }}>
                    <Stack
                        direction={{ base: 'column', lg: 'row' }}
                        align={{ lg: 'flex-start' }}
                        spacing={{ base: '8', md: '16' }}
                    >
                        <Stack spacing={{ base: '8', md: '10' }} flex="2">
                            <Heading fontSize="2xl" fontWeight="extrabold">
                                Shopping Cart ({data.cartItems.length} items)
                            </Heading>

                            <Stack spacing="6">
                                {data.cartItems.map((item) => (
                                    <CartItem key={item.id} cartItem={item} />
                                ))}
                            </Stack>
                            {data.cartItems.length === 0 && (
                                <VStack spacing={6} minHeight="50vh">
                                    <Text>Shopping cart is empty</Text>
                                    <Button variant="solid" colorScheme="blue" as={ReactRouterLink} to="/catalog">
                                        Continue shopping
                                    </Button>
                                </VStack>
                            )}
                        </Stack>
                        {data.cartItems.length > 0 && (
                            <Flex direction="column" align="center" flex="1" position="sticky" top={4}>
                                <CartOrderSummary />
                                <HStack mt="6" fontWeight="semibold">
                                    <p>or</p>
                                    <Link
                                        as={ReactRouterLink}
                                        to="/catalog"
                                        color={useColorModeValue('blue.500', 'blue.200')}
                                    >
                                        Continue shopping
                                    </Link>
                                </HStack>
                            </Flex>
                        )}
                    </Stack>
                </Card>
            )}
        </Box>
    );
};

export default CartPage;
