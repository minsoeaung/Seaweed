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
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react'
import {CartProductMeta} from './CartProductMeta'
import {PriceTag} from '../../../components/PriceTag'
import {CartItem as CartItemType} from "../../../types/cartResponse.ts";
import {useRef} from "react";
import {useAddToCart} from "../../../hooks/mutations/useAddToCart.ts";
import {DeleteIcon} from "@chakra-ui/icons";
import {PRODUCT_IMAGES} from "../../../constants/fileUrls.ts";

export const CartItem = ({cartItem}: { cartItem: CartItemType }) => {
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
                image={PRODUCT_IMAGES + product.id}
                isGiftWrapping={false}
            />

            {/* Desktop */}
            <Flex width="full" justify="space-between" display={{base: 'none', md: 'flex'}}>
                <Select
                    maxW="80px"
                    aria-label="Select quantity"
                    value={quantity}
                    onChange={e => handleQuantityChange(+e.currentTarget.value)}
                >
                    {Array(product.quantityInStock).fill('').map((_, index) => (
                        <option value={`${index + 1}`}>{index + 1}</option>
                    ))}
                </Select>
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
                <Button variant="ghost" size={{base: 'sm', md: 'md'}} onClick={onOpen}>
                    Remove
                </Button>
                <Select
                    maxW="64px"
                    aria-label="Select quantity"
                    focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
                    value={quantity}
                    onChange={e => handleQuantityChange(+e.currentTarget.value)}
                >
                    {Array(product.quantityInStock).fill('').map((_, index) => (
                        <option value={`${index + 1}`} key={index}>{index + 1}</option>
                    ))}
                </Select>
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