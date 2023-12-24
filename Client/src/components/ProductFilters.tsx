import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tag,
    TagLabel,
    TagLeftIcon,
    useColorModeValue,
    useDisclosure,
    Wrap,
} from '@chakra-ui/react';
import { AiOutlineFilter } from 'react-icons/ai';
import { memo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProductFilters from '../hooks/queries/useProductFilters.ts';
import { IoMdRadioButtonOff } from 'react-icons/io';
import { CheckCircleIcon } from '@chakra-ui/icons';

export const ProductFilters = memo(() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data, isLoading } = useProductFilters();

    const [selectedBrands, setSelectedBrands] = useState<Record<string, true>>({});
    const [selectedCategories, setSelectedCategories] = useState<Record<string, true>>({});

    // Get info from params and save in local state
    useEffect(() => {
        const brands = searchParams.get('brands');
        const brandsArray = brands ? brands.split(',') : [];
        const brandsObj: Record<string, true> = {};
        brandsArray.forEach((b) => (brandsObj[b] = true));
        setSelectedBrands(brandsObj);

        const cats = searchParams.get('categories');
        const catsArray = cats ? cats.split(',') : [];
        const catsObj: Record<string, true> = {};
        catsArray.forEach((b) => (catsObj[b] = true));
        setSelectedCategories(catsObj);
    }, [isOpen]);

    const handleBrandsChange = (name: string) => {
        setSelectedBrands((prevState) => {
            const d = { ...prevState };
            if (d[name]) delete d[name];
            else d[name] = true;
            return d;
        });
    };

    const handleCategoriesChange = (name: string) => {
        setSelectedCategories((prevState) => {
            const d = { ...prevState };
            if (d[name]) delete d[name];
            else d[name] = true;
            return d;
        });
    };

    const handleSave = () => {
        searchParams.set('brands', Object.keys(selectedBrands).join(','));
        searchParams.set('categories', Object.keys(selectedCategories).join(','));
        setSearchParams(searchParams);
        onClose();
    };

    const handleReset = () => {
        setSelectedCategories({});
        setSelectedBrands({});
    };

    const filterApplied = !!Object.keys(selectedCategories).length || !!Object.keys(selectedBrands).length;
    
    return (
        <>
            <IconButton
                aria-label="Filter"
                variant="ghost"
                size={{ base: 'sm', md: 'lg' }}
                colorScheme={filterApplied ? 'blue' : 'gray'}
                icon={<AiOutlineFilter />}
                onClick={onOpen}
                isLoading={isLoading}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Filter</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Heading as="h3" size="sm" color={useColorModeValue('red.500', 'red.300')}>
                            Filter by brand
                        </Heading>
                        <Box overflowY="auto" mt={3}>
                            <Wrap>
                                {data &&
                                    data.brands.map((brand) => {
                                        const isSelected = selectedBrands[brand.name];

                                        return (
                                            <Tag
                                                key={brand.id}
                                                variant={isSelected ? 'outline' : 'subtle'}
                                                colorScheme={isSelected ? 'messenger' : 'gray'}
                                                onClick={() => handleBrandsChange(brand.name)}
                                                cursor="pointer"
                                                userSelect="none"
                                            >
                                                <TagLeftIcon>
                                                    {isSelected ? (
                                                        <CheckCircleIcon />
                                                    ) : (
                                                        <Icon as={IoMdRadioButtonOff} fontSize="24px" />
                                                    )}
                                                </TagLeftIcon>
                                                <TagLabel>{brand.name}</TagLabel>
                                            </Tag>
                                        );
                                    })}
                            </Wrap>
                        </Box>
                        <Heading as="h3" size="sm" mt={4} color={useColorModeValue('red.500', 'red.300')}>
                            Filter by category
                        </Heading>
                        <Box overflowY="auto" mt={3}>
                            <Wrap>
                                {data &&
                                    data.categories.map((category) => {
                                        const isSelected = selectedCategories[category.name];

                                        return (
                                            <Tag
                                                key={category.id}
                                                variant={isSelected ? 'outline' : 'subtle'}
                                                colorScheme={isSelected ? 'messenger' : 'gray'}
                                                onClick={() => handleCategoriesChange(category.name)}
                                                cursor="pointer"
                                                userSelect="none"
                                            >
                                                <TagLeftIcon>
                                                    {isSelected ? (
                                                        <CheckCircleIcon />
                                                    ) : (
                                                        <Icon as={IoMdRadioButtonOff} fontSize="24px" />
                                                    )}
                                                </TagLeftIcon>
                                                <TagLabel>{category.name}</TagLabel>
                                            </Tag>
                                        );
                                    })}
                            </Wrap>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <HStack>
                            <Button onClick={onClose}>Close</Button>
                            <Button onClick={handleReset}>Reset</Button>
                            <Button colorScheme="blue" onClick={handleSave}>
                                Apply
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
});
