import {
    AbsoluteCenter,
    Box,
    Card,
    Center,
    Flex,
    Heading,
    HStack,
    Link,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useCart } from '../../../hooks/queries/useCart.ts';
import { CartItem } from './CartItem.tsx';
import { CartOrderSummary } from './CartOrderSummary.tsx';
import { Link as ReactRouterLink } from 'react-router-dom';
import AntdSpin from '../../../components/AntdSpin';
import { Fallback } from '../../../components/Fallback';

const CartPage = () => {
    const { isLoading, isFetching, data, isError } = useCart();

    if (isError) {
        return (
            <Center mt={10}>
                <p>Error loading cart items.</p>
            </Center>
        );
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
                        </Stack>
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
                    </Stack>
                </Card>
            )}
        </Box>
    );
};

export default CartPage;
