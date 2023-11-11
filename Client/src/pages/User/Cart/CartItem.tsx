import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Flex,
    IconButton,
    Select,
    SelectProps,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react'
import {CartProductMeta} from './CartProductMeta'
import {PriceTag} from '../../../components/Products/PriceTag'
import {CartItem} from "../../../types/cartResponse.ts";
import {useRef} from "react";
import {useAddToCart} from "../../../hooks/mutations/useAddToCart.ts";
import {DeleteIcon} from "@chakra-ui/icons";

const QuantitySelect = (props: SelectProps) => {
    return (
        <Select
            maxW="64px"
            aria-label="Select quantity"
            focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
            {...props}
        >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </Select>
    )
}

export const CartItem = ({cartItem}: { cartItem: CartItem }) => {
    const {
        quantity,
        total,
        product,
    } = cartItem

    const cancelRef = useRef(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const mutation = useAddToCart();

    const handleQuantityChange = async (quantity: number) => {
        await mutation.mutateAsync({
            productId: product.id,
            quantity: quantity
        })
    }

    return (
        <Flex direction={{base: 'column', md: 'row'}} justify="space-between" align="center">
            <CartProductMeta
                name={product.name}
                description={product.brand.name}
                image={'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80'}
                isGiftWrapping={false}
            />

            {/* Desktop */}
            <Flex width="full" justify="space-between" display={{base: 'none', md: 'flex'}}>
                <QuantitySelect
                    value={quantity}
                    onChange={async (e) => {
                        await handleQuantityChange(+e.currentTarget.value)
                    }}
                />
                <PriceTag price={total} currency="USD"/>
                <IconButton
                    variant="ghost"
                    colorScheme="red"
                    aria-label={`Remove ${product.name} from cart`}
                    icon={<DeleteIcon/>}
                    onClick={onOpen}
                />
            </Flex>

            {/* Mobile */}
            <Flex
                mt="4"
                align="center"
                width="full"
                justify="space-between"
                display={{base: 'flex', md: 'none'}}
            >
                <Button variant="ghost" onClick={onOpen}>
                    Delete
                </Button>
                <QuantitySelect
                    value={quantity}
                    onChange={(e) => {
                        handleQuantityChange?.(+e.currentTarget.value)
                    }}
                />
                <PriceTag price={total} currency="USD"/>
            </Flex>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Are you sure to remove from cart?
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={() => handleQuantityChange(0)} ml={3}
                                    isLoading={mutation.isLoading}>
                                Remove
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
    )
}