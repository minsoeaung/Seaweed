import { Box, Button, ButtonGroup, Center, Heading, Image, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react';
import { NamedApiResource } from '../../types/namedApiResource.ts';
import AntdSpin from '../../components/AntdSpin';
import { IoIosImages } from 'react-icons/io';
import { EditIcon } from '@chakra-ui/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { Fallback } from '../../components/Fallback';
import { useCategories } from '../../hooks/queries/useCategories.ts';
import placeholderImg from '../../assets/placeholderImage.webp';
import { CATEGORY_IMAGES } from '../../constants/fileUrls.ts';

const Categories = () => {
    const { data, isLoading, isFetching } = useCategories();

    if (isLoading) {
        return (
            <Center>
                <AntdSpin />
            </Center>
        );
    }

    if (!data) return null;

    return (
        <Box>
            {isFetching && <Fallback />}
            <Wrap spacing="30px">
                {data.map((cat) => (
                    <WrapItem key={cat.id}>
                        <Category category={cat} />
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    );
};

const Category = ({ category }: { category: NamedApiResource }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <Box
            maxW={{ base: '100%', sm: '200px' }}
            bg={useColorModeValue('white', 'gray.800')}
            overflow={'hidden'}
            rounded="xl"
        >
            <Image
                src={CATEGORY_IMAGES + category.id}
                fallbackSrc={placeholderImg}
                height="150px"
                aspectRatio="4/3"
                objectFit="cover"
                alt="Example"
                rounded="xl"
                overflow="hidden"
                mb={4}
            />
            <Center pl={2} pr={2}>
                <Heading
                    color={useColorModeValue('gray.700', 'white')}
                    fontSize={'2xl'}
                    fontFamily={'body'}
                    noOfLines={1}
                >
                    {category.name}
                </Heading>
            </Center>
            <Box p={2}>
                <Center>
                    <ButtonGroup isAttached>
                        <Button
                            leftIcon={<IoIosImages />}
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => {
                                searchParams.set('tab', '0');
                                searchParams.set('categories', category.name);
                                setSearchParams(searchParams);
                            }}
                        >
                            Products
                        </Button>
                        <Button
                            as={Link}
                            to={`${category.id}?type=category`}
                            leftIcon={<EditIcon />}
                            variant="ghost"
                            colorScheme="blue"
                        >
                            Edit
                        </Button>
                    </ButtonGroup>
                </Center>
            </Box>
        </Box>
    );
};

export default Categories;
