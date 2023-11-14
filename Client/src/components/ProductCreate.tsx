import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Textarea,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import useProductFilters from "../hooks/queries/useProductFilters.ts";
import {ChangeEvent, memo, useState} from "react";
import {CreateProductDto} from "../types/createProductDto.ts";
import {useCreateProduct} from "../hooks/mutations/useCreateProduct.ts";

export const ProductCreate = memo(() => {
    const [values, setValues] = useState<CreateProductDto>({
        name: "",
        sku: "",
        description: "",
        picture: null,
        album: null,
        price: 0,
        quantityInStock: 0,
        brandId: 0,
        categoryId: 0,
    });

    const {isOpen, onOpen, onClose} = useDisclosure();

    const {data: productFilters, isLoading: productFiltersLoading} = useProductFilters();

    const mutation = useCreateProduct();

    const handleFormChange = (name: keyof CreateProductDto) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if ((name === "picture" || name === "album")) {
            setValues(prevState => ({
                ...prevState,
                [name]: (e.target as HTMLInputElement).files
            }))
        } else {
            setValues(prevState => ({
                ...prevState,
                [name]: e.target.value
            }))
        }
    }

    const handleSubmit = async () => {
        await mutation.mutateAsync(values);
    }

    return (
        <>
            <Button variant="solid" colorScheme="blue" onClick={onOpen} isLoading={productFiltersLoading}>
                Create product
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create product</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <VStack spacing={2}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input required type='text' name='name' onChange={handleFormChange(("name"))}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Sku</FormLabel>
                                <Input required type='text' name='sku' onChange={handleFormChange(("sku"))}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea required placeholder='Here is a sample placeholder' name='description'
                                          onChange={handleFormChange(("description"))}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Picture</FormLabel>
                                <Input required type='file' accept='image/png' multiple={false} name="picture"
                                       onChange={handleFormChange(("picture"))}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Album</FormLabel>
                                <Input required type='file' accept='image/*' multiple name="album"
                                       onChange={handleFormChange(("album"))}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Price</FormLabel>
                                <Input required type='number' name='price' min={0}
                                       onChange={handleFormChange(("price"))}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Quantity In Stock</FormLabel>
                                <Input required type='number' name='quantityInStock' min={0} max={500}
                                       onChange={handleFormChange(("quantityInStock"))}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Category</FormLabel>
                                <Select required placeholder='Select a category' name='categoryId'
                                        onChange={handleFormChange(("categoryId"))}>
                                    {productFilters?.categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Brand</FormLabel>
                                <Select required placeholder='Select a brand' name='brandId'
                                        onChange={handleFormChange(("brandId"))}>
                                    {productFilters?.brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme='blue' onClick={handleSubmit} isLoading={mutation.isLoading}>Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
});