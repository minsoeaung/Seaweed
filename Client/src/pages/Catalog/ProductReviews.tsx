import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    HStack,
    Image,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { Reviews } from '../../components/Reviews.tsx';
import { useProductDetails } from '../../hooks/queries/useProductDetails.ts';
import { PRODUCT_IMAGES } from '../../constants/fileUrls.ts';
import placeholderImage from '../../assets/placeholderImage.webp';
import { useEffect } from 'react';

const ProductReviewsPage = () => {
    const { id } = useParams();

    const validId = typeof Number(id) === 'number' && Number(id) > 0 ? Number(id) : 0;

    const { data } = useProductDetails(id);

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, []);

    if (validId === 0) {
        return (
            <Box textAlign="center" py={10} px={6}>
                <WarningTwoIcon boxSize={'50px'} color={'orange.300'} />
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Product Not Found
                </Heading>
                <Text color={'gray.500'} mb={6}>
                    The product you&apos;re looking for does not seem to exist
                </Text>
            </Box>
        );
    }

    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            <Card variant="outline">
                {data && (
                    <CardHeader
                        position="sticky"
                        top={0}
                        border="1px"
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        zIndex={1}
                        bgColor={useColorModeValue('white', '#1A202C')}
                    >
                        <HStack alignItems="start" spacing={{ base: 2, md: 8 }}>
                            <Image
                                width="120px"
                                height="120px"
                                fit="cover"
                                src={PRODUCT_IMAGES + data.id}
                                alt={data.name}
                                fallbackSrc={placeholderImage}
                                draggable="false"
                            />
                            <VStack mt={2} alignItems="start">
                                <Text>{data.name}</Text>
                                <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm" noOfLines={3}>
                                    {data.description}
                                </Text>
                            </VStack>
                        </HStack>
                    </CardHeader>
                )}
                <CardBody>
                    <Reviews />
                </CardBody>
            </Card>
        </Box>
    );
};

export default ProductReviewsPage;
