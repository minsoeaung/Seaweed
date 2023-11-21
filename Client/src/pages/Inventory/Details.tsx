import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Highlight,
    HStack,
    IconButton,
    Input,
    Select,
    Text,
    Textarea,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import NotFoundPage from '../NotFound';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import AntdSpin from '../../components/AntdSpin';
import { BiSave } from 'react-icons/bi';
import { AddIcon, ChevronLeftIcon, DeleteIcon } from '@chakra-ui/icons';
import { useCategory } from '../../hooks/queries/useCategory.ts';
import { useCategoryCUD } from '../../hooks/mutations/useCategoryCUD.ts';
import { useBrand } from '../../hooks/queries/useBrand.ts';
import { useBrandCUD } from '../../hooks/mutations/useBrandCUD.ts';
import { useProductDetails } from '../../hooks/queries/useProductDetails.ts';
import { CreateProductDto } from '../../types/createProductDto.ts';
import { useCategories } from '../../hooks/queries/useCategories.ts';
import { useBrands } from '../../hooks/queries/useBrands.ts';
import { useProductCUD } from '../../hooks/mutations/useProductCUD.ts';
import { ImageInputWithPreview } from '../../components/ImageInputWithPreview.tsx';
import { BRAND_IMAGES, CATEGORY_IMAGES, PRODUCT_IMAGES } from '../../constants/fileUrls.ts';

const validType = ['category', 'brand', 'product'] as const;

const Details = () => {
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const numId = Number(id);
    const navigate = useNavigate();

    const pageType = searchParams.get('type') as (typeof validType)[number];

    if (!validType.includes(pageType) || isNaN(numId)) {
        return <NotFoundPage />;
    }

    return (
        <Container maxW="7xl">
            <Card>
                <CardHeader>
                    <HStack>
                        <IconButton
                            icon={<ChevronLeftIcon fontSize="30px" />}
                            variant="ghost"
                            colorScheme="blue"
                            aria-label="Go back"
                            onClick={() => navigate(-1)}
                        />
                        <Heading fontSize="xl">
                            {numId > 0 ? 'Edit' : 'Add'} {pageType[0].toUpperCase() + pageType.slice(1)}
                        </Heading>
                    </HStack>
                </CardHeader>
                <CardBody>
                    {pageType === 'category' && <CategoryEdit id={numId} />}
                    {pageType === 'brand' && <BrandEdit id={numId} />}
                    {pageType === 'product' && <ProductEdit id={numId} />}
                </CardBody>
            </Card>
        </Container>
    );
};

const PRODUCT_INITIAL_STATE = {
    name: '',
    sku: '',
    description: '',
    picture: null,
    album: null,
    price: 0,
    quantityInStock: 0,
    brandId: 0,
    categoryId: 0,
};

const ProductEdit = ({ id }: { id: number }) => {
    const { data, isLoading, isError } = useProductDetails(String(id));
    const [values, setValues] = useState<CreateProductDto>(PRODUCT_INITIAL_STATE);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);

    const { data: categories } = useCategories();
    const { data: brands } = useBrands();

    const navigate = useNavigate();
    const mutation = useProductCUD();

    useEffect(() => {
        if (data) {
            setValues({
                name: data.name,
                picture: null,
                album: null,
                brandId: data.brandId,
                sku: data.sku,
                price: data.price,
                quantityInStock: data.quantityInStock,
                description: data.description,
                categoryId: data.categoryId,
            });
        }
    }, [data]);

    if (isLoading)
        return (
            <Center>
                <AntdSpin />
            </Center>
        );
    if (isError || (!data && id !== 0)) return <p>Error loading product.</p>;

    const handleFormChange =
        (name: keyof CreateProductDto) =>
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            if (name === 'album') {
                setValues((prevState) => ({
                    ...prevState,
                    [name]: (e.target as HTMLInputElement).files,
                }));
            } else {
                setValues((prevState) => ({
                    ...prevState,
                    [name]: e.target.value,
                }));
            }
        };

    const handlePictureInputChange = (files: FileList) => {
        setValues((prevState) => ({
            ...prevState,
            picture: files,
        }));
    };

    const handleCreateProduct = async () => {
        const result = await mutation.mutateAsync({
            type: 'CREATE',
            product: values,
        });
        if (result) {
            navigate(`/inventory/${result.id}?type=product`, { replace: true });
        }
    };

    const handleUpdateProduct = async () => {
        await mutation.mutateAsync({
            type: 'UPDATE',
            id: id,
            product: values,
        });
    };

    const handleDeleteProduct = async () => {
        await mutation.mutateAsync({
            type: 'DELETE',
            id: id,
            pushOnSuccess: '/inventory?pageSize=10&tab=0',
        });
    };

    return (
        <>
            <VStack spacing="8px">
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input required type="text" name="name" value={values.name} onChange={handleFormChange('name')} />
                </FormControl>
                <FormControl>
                    <FormLabel>Sku</FormLabel>
                    <Input required type="text" name="sku" value={values.sku} onChange={handleFormChange('sku')} />
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        required
                        placeholder="Product description"
                        name="description"
                        value={values.description}
                        onChange={handleFormChange('description')}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Picture</FormLabel>
                    <ImageInputWithPreview
                        onInputChange={handlePictureInputChange}
                        src={id ? PRODUCT_IMAGES + id : undefined}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Album</FormLabel>
                    <Input
                        required
                        type="file"
                        accept="image/*"
                        multiple
                        name="album"
                        onChange={handleFormChange('album')}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                        required
                        type="number"
                        name="price"
                        min={0}
                        value={values.price}
                        onChange={handleFormChange('price')}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Quantity In Stock</FormLabel>
                    <Input
                        required
                        type="number"
                        name="quantityInStock"
                        min={0}
                        max={500}
                        value={values.quantityInStock}
                        onChange={handleFormChange('quantityInStock')}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select
                        required
                        placeholder="Select a category"
                        name="categoryId"
                        value={values.categoryId}
                        onChange={handleFormChange('categoryId')}
                    >
                        {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Brand</FormLabel>
                    <Select
                        required
                        placeholder="Select a brand"
                        name="brandId"
                        value={values.brandId}
                        onChange={handleFormChange('brandId')}
                    >
                        {brands?.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>
            </VStack>
            <br />
            <br />
            <Flex justify="space-between">
                {id === 0 ? (
                    <Button
                        leftIcon={<AddIcon />}
                        variant="solid"
                        colorScheme="blue"
                        onClick={handleCreateProduct}
                        isLoading={mutation.isLoading}
                    >
                        Add
                    </Button>
                ) : (
                    data && (
                        <>
                            <Button
                                leftIcon={<BiSave />}
                                variant="solid"
                                colorScheme="blue"
                                onClick={handleUpdateProduct}
                                isLoading={mutation.isLoading}
                            >
                                Save
                            </Button>
                            <Button leftIcon={<DeleteIcon />} variant="outline" colorScheme="red" onClick={onOpen}>
                                Delete
                            </Button>
                        </>
                    )
                )}
            </Flex>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete product
                        </AlertDialogHeader>
                        <AlertDialogBody>Are you sure to delete the product?</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteProduct}
                                ml={3}
                                isLoading={mutation.isLoading}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

const CategoryEdit = ({ id }: { id: number }) => {
    const [value, setValue] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);

    const { data, isLoading } = useCategory(id);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const cancelRef = useRef(null);

    const mutation = useCategoryCUD();

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setValue(data.name);
        }
    }, [data]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

    const handleDeleteCategory = async () => {
        await mutation.mutateAsync({
            type: 'DELETE',
            id: id,
            pushOnSuccess: '/inventory?pageSize=10&tab=2',
        });
    };

    const handleUpdateCategory = async () => {
        await mutation.mutateAsync({
            type: 'UPDATE',
            id: id,
            category: {
                name: value,
                files: files,
            },
        });
    };

    const handleCreateCategory = async () => {
        if (!files) return;

        const result = await mutation.mutateAsync({
            type: 'CREATE',
            category: {
                name: value,
                files: files,
            },
        });
        if (result) {
            navigate(`/inventory/${result.id}?type=category`, { replace: true });
        }
    };

    const handleImageInputChange = (files: FileList) => {
        setFiles(files);
    };

    if (isLoading) {
        return (
            <Center>
                <AntdSpin />
            </Center>
        );
    }

    if (!data && id !== 0) return <p>Error loading category.</p>;

    return (
        <>
            <Text mb="8px">Category Name</Text>
            <Input value={value} onChange={handleChange} placeholder="Category name" />
            <br />
            <br />
            <Text mb="8px">Category Image</Text>
            <ImageInputWithPreview
                onInputChange={handleImageInputChange}
                src={id === 0 ? undefined : CATEGORY_IMAGES + id}
            />
            <br />
            <br />
            <Flex justify="space-between">
                {id === 0 ? (
                    <Button
                        leftIcon={<BiSave />}
                        variant="solid"
                        colorScheme="blue"
                        isDisabled={value.trim().length === 0 || !files}
                        onClick={handleCreateCategory}
                        isLoading={mutation.isLoading}
                    >
                        Add
                    </Button>
                ) : (
                    data && (
                        <>
                            <Button
                                leftIcon={<BiSave />}
                                variant="solid"
                                colorScheme="blue"
                                isDisabled={data.name === value || value.trim().length === 0 ? !files : false}
                                onClick={handleUpdateCategory}
                                isLoading={mutation.isLoading}
                            >
                                Save
                            </Button>
                            <Button leftIcon={<DeleteIcon />} variant="outline" colorScheme="red" onClick={onOpen}>
                                Delete
                            </Button>
                        </>
                    )
                )}
            </Flex>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete category
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Highlight
                                query="All the related products will be deleted too"
                                styles={{
                                    px: '1',
                                    py: '1',
                                    bg: 'red.700',
                                    color: 'white',
                                }}
                            >
                                Are you sure? All the related products will be deleted too.
                            </Highlight>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteCategory}
                                ml={3}
                                isLoading={mutation.isLoading}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

const BrandEdit = ({ id }: { id: number }) => {
    const [value, setValue] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);

    const { data, isLoading } = useBrand(id);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const cancelRef = useRef(null);

    const mutation = useBrandCUD();

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setValue(data.name);
        }
    }, [data]);

    const handleImageInputChange = (files: FileList) => {
        setFiles(files);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

    const handleDeleteBrand = async () => {
        await mutation.mutateAsync({
            type: 'DELETE',
            id: id,
            pushOnSuccess: '/inventory?pageSize=10&tab=1',
        });
    };

    const handleUpdateBrand = async () => {
        await mutation.mutateAsync({
            type: 'UPDATE',
            id: id,
            brand: {
                name: value,
                files,
            },
        });
    };

    const handleCreateBrand = async () => {
        if (!files) return;

        const result = await mutation.mutateAsync({
            type: 'CREATE',
            brand: {
                name: value,
                files,
            },
        });
        if (result) {
            navigate(`/inventory/${result.id}?type=brand`, { replace: true });
        }
    };

    if (isLoading) {
        return (
            <Center>
                <AntdSpin />
            </Center>
        );
    }

    if (!data && id !== 0) return <p>Error loading brand.</p>;

    return (
        <>
            <Text mb="8px">Brand Name</Text>
            <Input value={value} onChange={handleChange} placeholder="Brand name" />
            <br />
            <br />
            <Text mb="8px">Brand Image</Text>
            <ImageInputWithPreview
                onInputChange={handleImageInputChange}
                src={id === 0 ? undefined : BRAND_IMAGES + id}
            />
            <br />
            <br />
            <Flex justify="space-between">
                {id === 0 ? (
                    <Button
                        leftIcon={<BiSave />}
                        variant="solid"
                        colorScheme="blue"
                        isDisabled={value.trim().length === 0 || !files}
                        onClick={handleCreateBrand}
                        isLoading={mutation.isLoading}
                    >
                        Add
                    </Button>
                ) : (
                    data && (
                        <>
                            <Button
                                leftIcon={<BiSave />}
                                variant="solid"
                                colorScheme="blue"
                                isDisabled={data.name === value || value.trim().length === 0 ? !files : false}
                                onClick={handleUpdateBrand}
                                isLoading={mutation.isLoading}
                            >
                                Save
                            </Button>
                            <Button leftIcon={<DeleteIcon />} variant="outline" colorScheme="red" onClick={onOpen}>
                                Delete
                            </Button>
                        </>
                    )
                )}
            </Flex>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete brand
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Highlight
                                query="All the related products will be deleted too"
                                styles={{
                                    px: '1',
                                    py: '1',
                                    bg: 'red.700',
                                    color: 'white',
                                }}
                            >
                                Are you sure? All the related products will be deleted too.
                            </Highlight>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteBrand} ml={3} isLoading={mutation.isLoading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default Details;
