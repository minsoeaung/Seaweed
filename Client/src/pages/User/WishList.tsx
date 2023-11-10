import {useWishList} from "../../hooks/queries/useWishList.ts";
import {
    AbsoluteCenter,
    Button,
    Card,
    Container,
    HStack,
    Image,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack
} from "@chakra-ui/react";
import {formatPrice} from "../../utilities/formatPrice.ts";
import AntdSpin from "../../components/AntdSpin";

const WishListPage = () => {
    const {isLoading, data, isError} = useWishList();

    if (isLoading) {
        return (
            <AbsoluteCenter axis="both">
                <AntdSpin/>
            </AbsoluteCenter>
        )
    }

    return (
        <Container maxWidth="7xl">
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
                                                    src='https://bit.ly/dan-abramov'
                                                    alt='Dan Abramov'
                                                    borderRadius={{base: 'md', md: 'xl'}}
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
                                        <Td>
                                            <Button colorScheme='blue' variant="outline">Add to cart</Button>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    )
}

export default WishListPage;