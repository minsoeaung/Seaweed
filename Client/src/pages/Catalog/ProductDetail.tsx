import {useParams} from "react-router-dom";
import {
    AbsoluteCenter,
    Box,
    Button,
    Card,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    Text,
    VStack
} from "@chakra-ui/react";
import {useProductDetails} from "../../hooks/queries/useProductDetails.ts";
import {WarningTwoIcon} from "@chakra-ui/icons";
import {Rating} from "../../components/Rating.tsx";
import {ImageSlider} from "../../components/ImageSlider.tsx";
import {PriceTag} from "../../components/PriceTag.tsx";
import {AddToCartButton} from "../../components/AddToCartButton.tsx";
import {useCart} from "../../hooks/queries/useCart.ts";
import {useWishList} from "../../hooks/queries/useWishList.ts";
import AntdSpin from "../../components/AntdSpin";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import {useToggleWishList} from "../../hooks/mutations/useToggleWishList.ts";
import {PRODUCT_IMAGES} from "../../constants/fileUrls.ts";

type Params = {
    id: string;
};

const ProductDetailPage = () => {
    const {id} = useParams<Params>();

    // const [quantity, setQuantity] = useState();

    const {data, isLoading, isError} = useProductDetails(id);

    const {data: cart} = useCart();
    const {data: wishList} = useWishList();
    const favoriteMutation = useToggleWishList();


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
        <Container maxWidth="7xl">
            <Card variant="outline" p={8}>
                <Flex justifyContent="space-between">
                    <Box width="50%" pr={{base: 0, sm: 4, lg: 8}}>
                        <VStack alignItems="start">
                            <HStack>
                                <Rating max={5} defaultValue={3}/>
                                <Text color={'gray.500'}>
                                    12 Reviews
                                </Text>
                            </HStack>
                            <Heading
                                mt={1}
                                fontSize={{base: '1xl', sm: '2xl', lg: '3xl'}}>
                                {data.name}
                            </Heading>
                            <Text color={'gray.500'}>By {data.brand.name}</Text>
                            <PriceTag currency="USD" price={data.price} priceProps={{fontSize: "3xl"}}/>
                            <Text fontSize='lg' mt={2}>{data.description}</Text>
                            <br/>
                            {/*<ButtonGroup variant='outline' spacing='6' border="1px" p={2} rounded="lg"*/}
                            {/*             borderColor={useColorModeValue("gray.200", "rgba(255, 255, 255, 0.16)")}>*/}
                            {/*    <IconButton*/}
                            {/*        variant="solid"*/}
                            {/*        aria-label='Reduce product quantity by 1'*/}
                            {/*        icon={<MinusIcon/>}*/}
                            {/*    />*/}
                            {/*    <Button variant="unstyled">1</Button>*/}
                            {/*    <IconButton*/}
                            {/*        variant="solid"*/}
                            {/*        aria-label='Increase product quantity by 1'*/}
                            {/*        icon={<AddIcon/>}*/}
                            {/*    />*/}
                            {/*</ButtonGroup>*/}
                            <HStack w="full">
                                <AddToCartButton
                                    buttonProps={{
                                        width: {base: "full", md: "50%", lg: "50%"},
                                        variant: isInCart ? "outline" : "solid"
                                    }}
                                    productId={data.id}
                                    isInCart={isInCart}
                                />
                                <Button
                                    leftIcon={<Icon as={isFavorite ? AiFillHeart : AiOutlineHeart}
                                                    transition="all 0.15s ease" color={isFavorite ? "red" : ""}/>}
                                    colorScheme='blue'
                                    width="50%"
                                    variant={isFavorite ? 'outline' : 'solid'}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        await favoriteMutation.mutateAsync({
                                            type: isFavorite ? "REMOVE" : "ADD",
                                            productId: data.id
                                        })
                                    }}
                                    isLoading={favoriteMutation.isLoading}
                                >
                                    {isFavorite ? "In favorite" : "Favorite"}
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                    <Box width="50%" height="50vh">
                        <ImageSlider imgHeight="50vh" images={[PRODUCT_IMAGES + data.id]}/>
                    </Box>
                </Flex>
            </Card>
        </Container>
    )
}

export default ProductDetailPage;