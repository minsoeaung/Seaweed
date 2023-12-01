import { useWishList } from '../../hooks/queries/useWishList.ts';
import {
    AbsoluteCenter,
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    ButtonGroup,
    Card,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Stack,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure,
    useMediaQuery,
    VStack,
} from '@chakra-ui/react';
import { formatPrice } from '../../utilities/formatPrice.ts';
import AntdSpin from '../../components/AntdSpin';
import { DeleteIcon } from '@chakra-ui/icons';
import React, { useRef } from 'react';
import { useToggleWishList } from '../../hooks/mutations/useToggleWishList.ts';
import { useCart } from '../../hooks/queries/useCart.ts';
import { Fallback } from '../../components/Fallback';
import { AddToCartButton } from '../../components/AddToCartButton.tsx';
import { PRODUCT_IMAGES } from '../../constants/fileUrls.ts';
import placeholderImage from '../../assets/placeholderImage.webp';
import { PriceTag } from '../../components/PriceTag.tsx';
import { Link as ReactRouterLink } from 'react-router-dom';

const WishListPage = () => {
    const { isLoading, data, isError, isFetching } = useWishList();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);
    const [isMobile] = useMediaQuery('(max-width: 400px)');
    const productIdToRemoveRef = useRef<number | null>(null);

    const mutation = useToggleWishList();
    const { data: cart } = useCart();

    const handleRemoveProduct = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (productIdToRemoveRef.current) {
            await mutation.mutateAsync({
                productId: productIdToRemoveRef.current,
                type: 'REMOVE',
            });
        }
        onClose();
    };

    if (isLoading) {
        return (
            <AbsoluteCenter axis="both">
                <AntdSpin />
            </AbsoluteCenter>
        );
    }

    if (!data) return null;

    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            {isFetching && <Fallback />}
            {isMobile ? (
                <Card variant="outline" px={{ base: '4', md: '8', lg: '12' }} py={{ base: '6', md: '8', lg: '10' }}>
                    <Stack spacing={{ base: '8', md: '10' }} flex="2">
                        <Heading fontSize="2xl" fontWeight="extrabold">
                            Wishlist ({data.length} items)
                        </Heading>

                        <Stack spacing="6">
                            {data.length === 0 && (
                                <VStack spacing={6} minHeight="50vh">
                                    <Text>Your wishlist is empty</Text>
                                    <Button variant="solid" colorScheme="blue" as={ReactRouterLink} to="/catalog">
                                        Continue shopping
                                    </Button>
                                </VStack>
                            )}
                            {data.map((item) => (
                                <Flex key={item.productId} direction="column" justify="space-between" align="center">
                                    <HStack w="full">
                                        <Image
                                            width="100px"
                                            height="100px"
                                            objectFit="cover"
                                            src={PRODUCT_IMAGES + item.product.id}
                                            alt="Dan Abramov"
                                            borderRadius={{
                                                base: 'md',
                                                md: 'xl',
                                            }}
                                            fallbackSrc={placeholderImage}
                                        />
                                        <VStack alignItems="start">
                                            <b>{item.product.name}</b>
                                            <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
                                                {item.product.brand.name}
                                            </Text>
                                            <PriceTag price={item.product.price} currency="USD" />
                                        </VStack>
                                    </HStack>
                                    <Flex
                                        mt="4"
                                        align="center"
                                        width="full"
                                        justify="space-between"
                                        display={{ base: 'flex', md: 'none' }}
                                    >
                                        <Button
                                            variant="ghost"
                                            color={useColorModeValue('red.500', 'red.400')}
                                            onClick={() => {
                                                productIdToRemoveRef.current = item.productId;
                                                onOpen();
                                            }}
                                        >
                                            Remove
                                        </Button>
                                        <ButtonGroup spacing={4} variant="outline" justifyContent="end">
                                            <AddToCartButton
                                                buttonProps={{
                                                    variant: 'ghost',
                                                    isDisabled: !cart,
                                                }}
                                                productId={item.product.id}
                                                isInCart={
                                                    cart
                                                        ? cart.cartItems.findIndex(
                                                              (c) => c.product.id === item.product.id
                                                          ) >= 0
                                                        : false
                                                }
                                            />
                                        </ButtonGroup>
                                    </Flex>
                                </Flex>
                            ))}
                        </Stack>
                    </Stack>
                </Card>
            ) : (
                <Card variant="outline">
                    <TableContainer>
                        <Table variant="simple">
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
                                ) : (
                                    data &&
                                    data.map((item) => (
                                        <Tr key={item.productId}>
                                            <Td>
                                                <HStack alignItems="start">
                                                    <Image
                                                        width="70px"
                                                        height="70px"
                                                        objectFit="cover"
                                                        src={PRODUCT_IMAGES + item.product.id}
                                                        alt="Dan Abramov"
                                                        borderRadius={{
                                                            base: 'md',
                                                            md: 'xl',
                                                        }}
                                                        fallbackSrc={placeholderImage}
                                                    />
                                                    <VStack alignItems="start">
                                                        <b>{item.product.name}</b>
                                                        <Text
                                                            color={useColorModeValue('gray.600', 'gray.400')}
                                                            fontSize="sm"
                                                        >
                                                            {item.product.brand.name}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </Td>
                                            <Td>{formatPrice(item.product.price)}</Td>
                                            <Td>
                                                {item.product.quantityInStock === 0 ? (
                                                    <Tag colorScheme="blackAlpha">No stock</Tag>
                                                ) : item.product.quantityInStock < 10 ? (
                                                    <Tag colorScheme="red">Low stock</Tag>
                                                ) : (
                                                    <Tag>In stock</Tag>
                                                )}
                                            </Td>
                                            <Td isNumeric>
                                                <ButtonGroup spacing={4} variant="outline" justifyContent="end">
                                                    <AddToCartButton
                                                        buttonProps={{
                                                            isDisabled: !cart,
                                                        }}
                                                        productId={item.product.id}
                                                        isInCart={
                                                            cart
                                                                ? cart.cartItems.findIndex(
                                                                      (c) => c.product.id === item.product.id
                                                                  ) >= 0
                                                                : false
                                                        }
                                                    />
                                                    <IconButton
                                                        colorScheme="red"
                                                        aria-label="Remove from wishlist"
                                                        icon={<DeleteIcon />}
                                                        onClick={() => {
                                                            productIdToRemoveRef.current = item.productId;
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
                    {data.length === 0 && (
                        <VStack spacing={6} minHeight="50vh" justify="center">
                            <Text>Your wishlist is empty</Text>
                            <Button variant="solid" colorScheme="blue" as={ReactRouterLink} to="/catalog">
                                Continue shopping
                            </Button>
                        </VStack>
                    )}
                </Card>
            )}
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Are you sure to remove from wishlist?
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleRemoveProduct}
                                ml={3}
                                isLoading={mutation.isLoading}
                            >
                                Yes
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default WishListPage;
