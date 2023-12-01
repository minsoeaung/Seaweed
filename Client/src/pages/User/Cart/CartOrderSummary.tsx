import { Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { formatPrice } from '../../../utilities/formatPrice';
import { useCart } from '../../../hooks/queries/useCart.ts';
import { Link } from 'react-router-dom';

export const CartOrderSummary = () => {
    const { data } = useCart();

    if (!data) return null;

    return (
        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
            <Heading size="md">Order Summary</Heading>

            <Stack spacing="6">
                <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                        Total
                    </Text>
                    <Text fontSize="xl" fontWeight="extrabold">
                        {formatPrice(data.total)}
                    </Text>
                </Flex>
            </Stack>
            <Button as={Link} to="checkout" colorScheme="blue" size="lg" fontSize="md" rightIcon={<FaArrowRight />}>
                Checkout
            </Button>
        </Stack>
    );
};
