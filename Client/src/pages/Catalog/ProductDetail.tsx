import {useNavigate, useParams} from "react-router-dom";
import {
    AbsoluteCenter,
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Card,
    Flex,
    Heading,
    HStack,
    Icon,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    useMediaQuery,
    VStack
} from "@chakra-ui/react";
import {useProductDetails} from "../../hooks/queries/useProductDetails.ts";
import {WarningTwoIcon} from "@chakra-ui/icons";
import {Rating} from "../../components/Rating.tsx";
import {ImageSlider} from "../../components/ImageSlider.tsx";
import {PriceTag} from "../../components/PriceTag.tsx";
import {useCart} from "../../hooks/queries/useCart.ts";
import {useWishList} from "../../hooks/queries/useWishList.ts";
import AntdSpin from "../../components/AntdSpin";
import {AiOutlineHeart} from "react-icons/ai";
import {useToggleWishList} from "../../hooks/mutations/useToggleWishList.ts";
import {PRODUCT_IMAGES} from "../../constants/fileUrls.ts";
import {useRef} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import {AddToCartButton} from "../../components/AddToCartButton.tsx";

type Params = {
    id: string;
};

const ProductDetailPage = () => {
    const {id} = useParams<Params>();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const {data, isLoading, isError} = useProductDetails(id);
    const {data: cart} = useCart();
    const {data: wishList} = useWishList();
    const {user} = useAuth();

    const favoriteMutation = useToggleWishList();
    const navigate = useNavigate();
    const cancelRef = useRef(null);

    const [isMobile] = useMediaQuery('(max-width: 400px)');

    const goToLoginPage = () => navigate("/login");

    if (isLoading) {
        return (
            <AbsoluteCenter axis="both">
                <AntdSpin/>
            </AbsoluteCenter>
        )
    }

    if (isError) {
        return (
            <Box textAlign="center" py={10} px={6}>
                <WarningTwoIcon boxSize={'50px'} color={'orange.300'}/>
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Product Not Found
                </Heading>
                <Text color={'gray.500'} mb={6}>
                    The product you&apos;re looking for does not seem to exist
                </Text>
            </Box>
        )
    }

    if (!data) {
        return null;
    }

    const isInCart = cart ? cart.cartItems.findIndex(c => c.product.id === data.id) >= 0 : false;
    const isFavorite = wishList ? wishList.findIndex(w => w.productId === data.id) >= 0 : false;

    return (
        <Box
            maxW={{base: '3xl', lg: '7xl'}}
            mx="auto"
        >
            <Card variant="outline" p={{base: 6, lg: 12}}>
                <Flex justifyContent="space-between" direction={{base: 'column', lg: 'row'}}>
                    <Box width="100%" height="30vh" mb={8} display={{base: 'block', lg: 'none'}}>
                        <ImageSlider imgHeight="50vh" images={[PRODUCT_IMAGES + data.id]}/>
                    </Box>
                    <Box width={{base: '100%', lg: '50%'}} pr={{base: 0, sm: 4, lg: 8}}>
                        <VStack alignItems="start">
                            <HStack>
                                <Rating max={5} defaultValue={3}/>
                                <Text color={'gray.500'}>
                                    12 Reviews
                                </Text>
                            </HStack>
                            <Heading
                                mt={1}
                                fontSize={{base: '1xl', sm: '2xl', lg: '4xl'}}
                            >
                                {data.name}
                            </Heading>
                            <Text color={'gray.500'}>By {data.brand.name}</Text>
                            <PriceTag currency="USD" price={data.price} priceProps={{fontSize: "2xl"}}/>
                            <Text fontSize='lg' mt={2}
                                  color={useColorModeValue("gray.600", "gray.400")}>{data.description}</Text>
                            <br/>
                            <Stack w="full" direction='row'>
                                <AddToCartButton
                                    buttonProps={{
                                        width: '50%',
                                        isDisabled: !cart
                                    }}
                                    productId={data.id}
                                    isInCart={isInCart}
                                />
                                <Button
                                    leftIcon={<Icon as={AiOutlineHeart}/>}
                                    colorScheme={isFavorite ? 'red' : 'blue'}
                                    width="50%"
                                    variant={'outline'}
                                    onClick={async (e) => {
                                        e.preventDefault();

                                        if (user) {
                                            await favoriteMutation.mutateAsync({
                                                type: isFavorite ? "REMOVE" : "ADD",
                                                productId: data.id
                                            })
                                        } else {
                                            onOpen();
                                        }
                                    }}
                                    isLoading={favoriteMutation.isLoading}
                                    style={{
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        overflow: "hidden"
                                    }}
                                >
                                    {isFavorite ? (isMobile ? "Remove" : "Remove from favorite") : "Favorite"}
                                </Button>
                            </Stack>
                        </VStack>
                    </Box>
                    <Box width="50%" height="50vh" display={{base: 'none', lg: 'block'}}>
                        <ImageSlider imgHeight="50vh" images={[PRODUCT_IMAGES + data.id]}/>
                    </Box>
                </Flex>
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
                            Please login first
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' variant='solid' onClick={goToLoginPage} ml={3}>
                                Login
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}

export default ProductDetailPage;