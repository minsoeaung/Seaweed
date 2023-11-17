import {Box, Button, ButtonGroup, Center, Heading, Image, useColorModeValue, Wrap, WrapItem} from "@chakra-ui/react";
import AntdSpin from "../../components/AntdSpin";
import {Fallback} from "../../components/Fallback";
import {NamedApiResource} from "../../types/namedApiResource.ts";
import {Link, useSearchParams} from "react-router-dom";
import {IoIosImages} from "react-icons/io";
import {EditIcon} from "@chakra-ui/icons";
import {useBrands} from "../../hooks/queries/useBrands.ts";

// TODO: try not to duplicate 
const Brands = () => {
    const {data, isLoading, isFetching} = useBrands();

    if (isLoading) {
        return <Center><AntdSpin/></Center>
    }

    if (!data) return null;

    return (
        <Box>
            {isFetching && <Fallback/>}
            <Wrap spacing='30px'>
                {data.map(brand => (
                    <WrapItem key={brand.id}>
                        <Brand brand={brand}/>
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    )
}

const Brand = ({brand}: { brand: NamedApiResource }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <Box
            maxW={{base: '100%', sm: '250px'}}
            overflow={'hidden'}
            bg={useColorModeValue('white', 'gray.800')}
            rounded='xl'
        >
            <Image
                src={
                    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
                height='200px'
                aspectRatio='4/3'
                objectFit='cover'
                alt="Example"
                overflow='hidden'
                mb={4}
            />
            <Center pl={2} pr={2}>
                <Heading
                    color={useColorModeValue('gray.700', 'white')}
                    fontSize={'2xl'}
                    fontFamily={'body'}
                    noOfLines={1}
                >
                    {brand.name}
                </Heading>
            </Center>
            <Box p={2}>
                <Center>
                    <ButtonGroup isAttached>
                        <Button
                            leftIcon={<IoIosImages/>}
                            variant='ghost'
                            colorScheme="blue"
                            onClick={() => {
                                searchParams.set("tab", "0");
                                searchParams.set("brands", brand.name)
                                setSearchParams(searchParams);
                            }}
                        >
                            Products
                        </Button>
                        <Button
                            as={Link}
                            to={`${brand.id}?type=brand`}
                            leftIcon={<EditIcon/>}
                            variant='ghost'
                            colorScheme="blue"
                        >
                            Edit
                        </Button>
                    </ButtonGroup>
                </Center>
            </Box>
        </Box>
    )
}

export default Brands;