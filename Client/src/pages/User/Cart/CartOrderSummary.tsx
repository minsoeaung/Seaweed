import {Button, Flex, Heading, Link, Stack, Text, Tooltip, useColorModeValue as mode,} from '@chakra-ui/react'
import {FaArrowRight} from 'react-icons/fa'
import {formatPrice} from '../../../utilities/formatPrice'
import {ReactNode} from 'react'
import {useCart} from "../../../hooks/queries/useCart.ts";

type OrderSummaryItemProps = {
    label: string
    value?: string
    children?: ReactNode
}

const OrderSummaryItem = (props: OrderSummaryItemProps) => {
    const {label, value, children} = props
    return (
        <Flex justify="space-between" fontSize="sm">
            <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
                {label}
            </Text>
            {value ? <Text fontWeight="medium">{value}</Text> : children}
        </Flex>
    )
}

export const CartOrderSummary = () => {
    const {data} = useCart();

    if (!data)
        return null;

    return (
        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
            <Heading size="md">Order Summary</Heading>

            <Stack spacing="6">
                <OrderSummaryItem label="Subtotal" value={formatPrice(data.total)}/>
                <OrderSummaryItem label="Shipping + Tax">
                    <Link href="#" textDecor="underline">
                        Calculate shipping
                    </Link>
                </OrderSummaryItem>
                <OrderSummaryItem label="Coupon Code">
                    <Link href="#" textDecor="underline">
                        Add coupon code
                    </Link>
                </OrderSummaryItem>
                <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                        Total
                    </Text>
                    <Text fontSize="xl" fontWeight="extrabold">
                        {formatPrice(data.total)}
                    </Text>
                </Flex>
            </Stack>
            <Tooltip label="This feature has not been implemented yet."
                     aria-label='This feature has not been implemented yet.'>
                <Button colorScheme="blue" size="lg" fontSize="md" rightIcon={<FaArrowRight/>}>
                    Checkout
                </Button>
            </Tooltip>
        </Stack>
    )
}