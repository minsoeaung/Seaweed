import {
    Box,
    Button,
    Checkbox,
    Heading,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useColorModeValue,
    useDisclosure,
    Wrap
} from "@chakra-ui/react";
import {AiOutlineFilter} from "react-icons/ai";
import useProductFilters from "../../hooks/query/useProductFilters.ts";
import {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

export const ProductFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const {data, isLoading} = useProductFilters();

    const [selectedBrands, setSelectedBrands] = useState<Record<string, true>>({});
    const [selectedCategories, setSelectedCategories] = useState<Record<string, true>>({});

    // Get info from params and save in local state
    useEffect(() => {
        const brands = searchParams.get("brands");
        const brandsArray = brands ? brands.split(",") : [];
        const brandsObj: Record<string, true> = {};
        brandsArray.forEach(b => brandsObj[b] = true)
        setSelectedBrands(brandsObj);

        const cats = searchParams.get("categories");
        const catsArray = cats ? cats.split(",") : [];
        const catsObj: Record<string, true> = {};
        catsArray.forEach(b => catsObj[b] = true)
        setSelectedCategories(catsObj);
    }, []);

    const handleBrandsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedBrands(prevState => {
            const d = {...prevState};
            if (event.target.checked) {
                d[event.target.name] = true;
            } else {
                delete d[event.target.name]
            }
            return d;
        });
    }, []);

    const handleCategoriesChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCategories(prevState => {
            const d = {...prevState};
            if (event.target.checked) {
                d[event.target.name] = true;
            } else {
                delete d[event.target.name]
            }
            return d;
        });
    }, []);

    const handleSave = () => {
        searchParams.set("brands", Object.keys(selectedBrands).join(","));
        searchParams.set("categories", Object.keys(selectedCategories).join(","));
        setSearchParams(searchParams);
    }

    return (
        <>
            <IconButton
                aria-label="Filter"
                variant="outline"
                icon={<AiOutlineFilter/>}
                onClick={onOpen}
                isLoading={isLoading}
            />
            <Modal isOpen={isOpen} onClose={onClose} colorScheme="blue">
                <ModalOverlay backdropFilter='blur(3px)'/>
                <ModalContent>
                    <ModalHeader>Filter</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Heading as="h3" size="sm" color={useColorModeValue('red.500', 'red.300')}>Brands</Heading>
                        <Box overflowY="auto" mt={2}>
                            <Wrap>
                                {data && data.brands.map((brand) => (
                                    <Checkbox
                                        key={brand.id}
                                        name={brand.name}
                                        onChange={handleBrandsChange}
                                        isChecked={selectedBrands[brand.name]}
                                    >
                                        {brand.name}
                                    </Checkbox>
                                ))}
                            </Wrap>
                        </Box>
                        <Heading as="h3" size="sm" mt={2}
                                 color={useColorModeValue('red.500', 'red.300')}>Categories</Heading>
                        <Box overflowY="auto" mt={2}>
                            <Wrap>
                                {data && data.categories.map((category) => (
                                    <Checkbox
                                        key={category.id}
                                        name={category.name}
                                        onChange={handleCategoriesChange}
                                        isChecked={selectedCategories[category.name]}
                                    >
                                        {category.name}
                                    </Checkbox>
                                ))}
                            </Wrap>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSave}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};