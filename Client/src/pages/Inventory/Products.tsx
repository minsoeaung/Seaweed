import {useSearchParams} from "react-router-dom";
import {usePaginatedProducts} from "../../hooks/queries/usePaginatedProducts.ts";
import ResponsivePagination from "react-responsive-pagination";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Center,
    Flex,
    HStack,
    IconButton,
    Input,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import 'react-responsive-pagination/themes/classic.css';
import {formatPrice} from "../../utilities/formatPrice.ts";
import {ProductFilters} from "../../components/ProductFilters.tsx";
import {ProductSortBy} from "../../components/ProductSortBy.tsx";
import React, {useRef, useState} from "react";
import {ProductCreate} from "../../components/ProductCreate.tsx";
import AntdSpin from "../../components/AntdSpin";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useDeleteProduct} from "../../hooks/mutations/useDeleteProduct.ts";
import {Fallback} from "../../components/Fallback/index.tsx";

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInputValue, setSearchInputValue] = useState(searchParams.get("searchTerm") || "");
    const {isOpen, onOpen, onClose} = useDisclosure();
    const cancelRef = useRef(null);
    const productIdToDelete = useRef<number>(0);

    const deleteMutation = useDeleteProduct();

    const {
        data,
        isLoading,
        isError,
        isFetching
    } = usePaginatedProducts(searchParams.toString());

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("pageNumber", String(page));
        setSearchParams(newParams);
    }

    if (isLoading) {
        return <Center><AntdSpin/></Center>
    }

    if (isError) {
        return <p>Problems</p>
    }

    if (!data) return null;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchParams.set("searchTerm", searchInputValue);
            setSearchParams(searchParams);
        }
    }

    const handleDeleteProduct = async () => {
        await deleteMutation.mutateAsync(productIdToDelete.current);
        onClose();
    }

    return (
        <Box>
            {isFetching && <Fallback/>}
            <Flex justifyContent="space-between" mb={4}>
                <ProductFilters/>
                <Input
                    type='search'
                    placeholder='Search product'
                    autoComplete='off'
                    name='search'
                    value={searchInputValue}
                    onChange={e => setSearchInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxW={"md"}
                />
                <ProductSortBy/>
                <ProductCreate/>
            </Flex>
            <TableContainer>
                <Table variant='simple'>
                    <Thead position="relative">
                        <Tr>
                            <Th>Id</Th>
                            <Th>Name</Th>
                            <Th>sku</Th>
                            <Th>Description</Th>
                            <Th>Price</Th>
                            <Th>Quantity</Th>
                            <Th>Brand</Th>
                            <Th>Category</Th>
                            <Th position="sticky" right={0}
                                bgColor={useColorModeValue("#EDF2F7", "#171923")}>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody position="relative">
                        {data.results.map(product => (
                            <Tr key={product.id}>
                                <Td>{product.id}</Td>
                                <Td>{product.name}</Td>
                                <Td>{product.sku}</Td>
                                <Td maxW="200px" overflow="hidden" textOverflow="ellipsis"
                                    whiteSpace="nowrap">{product.description}</Td>
                                <Td isNumeric>{formatPrice(product.price)}</Td>
                                <Td isNumeric>{product.quantityInStock}</Td>
                                <Td>{product.brand.name}</Td>
                                <Td>{product.category.name}</Td>
                                <Td position="sticky" right={0} bgColor={useColorModeValue("#EDF2F7", "#171923")}>
                                    <HStack>
                                        <IconButton
                                            aria-label="Delete product"
                                            icon={<DeleteIcon/>}
                                            size="sm"
                                            colorScheme="red"
                                            variant="outline"
                                            onClick={() => {
                                                productIdToDelete.current = product.id;
                                                onOpen();
                                            }}
                                        />
                                        <IconButton aria-label="Edit product" icon={<EditIcon/>} size="sm"
                                                    colorScheme="orange" variant="outline"/>
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                    {data.results.length === 0 && (
                        <TableCaption>Empty!</TableCaption>
                    )}
                </Table>
            </TableContainer>
            <br/>
            <ResponsivePagination
                current={data.pagination.currentPage}
                total={data.pagination.totalPages}
                onPageChange={handlePageChange}
            />
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
                            <Button colorScheme='red' onClick={handleDeleteProduct} ml={3}
                                    isLoading={deleteMutation.isLoading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}

export default Products;