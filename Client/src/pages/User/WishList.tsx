import {useWishList} from "../../hooks/queries/useWishList.ts";
import {
    AbsoluteCenter,
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    ButtonGroup,
    Card,
    Container,
    HStack,
    IconButton,
    Image,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {formatPrice} from "../../utilities/formatPrice.ts";
import AntdSpin from "../../components/AntdSpin";
import {DeleteIcon} from "@chakra-ui/icons";
import {useRef} from "react";
import {useToggleWishList} from "../../hooks/mutations/useToggleWishList.ts";
import {useCart} from "../../hooks/queries/useCart.ts";
import {Fallback} from "../../components/Fallback";
import {AddToCartButton} from "../../components/AddToCartButton.tsx";
import {PRODUCT_IMAGES} from "../../constants/fileUrls.ts";
import placeholderImage from '../../assets/placeholderImage.webp';

const WishListPage = () => {
    const {isLoading, data, isError, isFetching} = useWishList();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const cancelRef = useRef(null);
    const productIdToRemoveRef = useRef<number | null>(null);

    const mutation = useToggleWishList();
    const {data: cart} = useCart();

    const handleRemoveProduct = async () => {
        if (productIdToRemoveRef.current) {
            await mutation.mutateAsync({
                productId: productIdToRemoveRef.current,
                type: "REMOVE"
            })
        }
        onClose();
    }

    if (isLoading) {
        return (
            <AbsoluteCenter axis="both">
                <AntdSpin/>
            </AbsoluteCenter>
        )
    }

    return (
        <Container maxWidth="7xl">
            {isFetching && <Fallback/>}
            <Card variant="outline">
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th fontSize={16}>Product name</Th>
                                <Th fontSize={16}>Unit price</Th>
                                <Th fontSize={16}>Stock status</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {isError ? (
                                <p>Error loading wishlist.</p>
                            ) : data && (
                                data.map(w => (
                                    <Tr key={w.productId}>
                                        <Td>
                                            <HStack alignItems="start">
                                                <Image
                                                    width='70px'
                                                    height='70px'
                                                    objectFit='cover'
                                                    src={PRODUCT_IMAGES + w.product.id}
                                                    alt='Dan Abramov'
                                                    borderRadius={{base: 'md', md: 'xl'}}
                                                    fallbackSrc={placeholderImage}
                                                />
                                                <VStack alignItems="start">
                                                    <b>{w.product.name}</b>
                                                    <p>{w.product.brand.name}</p>
                                                </VStack>
                                            </HStack>
                                        </Td>
                                        <Td>{formatPrice(w.product.price)}</Td>
                                        <Td>
                                            {w.product.quantityInStock < 10
                                                ? <Tag colorScheme='red'>Low stock</Tag>
                                                : <Tag>In stock</Tag>}
                                        </Td>
                                        <Td isNumeric>
                                            <ButtonGroup spacing={4} variant='outline' justifyContent="end">
                                                <AddToCartButton
                                                    buttonProps={{isDisabled: !!cart}}
                                                    productId={w.product.id}
                                                    isInCart={cart ? cart.cartItems.findIndex(c => c.product.id === w.product.id) >= 0 : false}
                                                />
                                                <IconButton
                                                    colorScheme="red"
                                                    aria-label='Remove from wishlist'
                                                    icon={<DeleteIcon/>}
                                                    onClick={() => {
                                                        productIdToRemoveRef.current = w.productId
                                                        onOpen();
                                                    }}
                                                />
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Card>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Are you sure to remove from wishlist?
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleRemoveProduct} ml={3}
                                    isLoading={mutation.isLoading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    )
}

export default WishListPage;