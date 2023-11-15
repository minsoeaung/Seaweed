import {useNavigate, useParams, useSearchParams} from "react-router-dom";
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
    Center,
    Container,
    Flex,
    Highlight,
    Input,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import NotFoundPage from "../NotFound";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import AntdSpin from "../../components/AntdSpin";
import {BiSave} from "react-icons/bi";
import {DeleteIcon} from "@chakra-ui/icons";
import {useCategory} from "../../hooks/queries/useCategory.ts";
import {useCategoryCUD} from "../../hooks/mutations/useCategoryCUD.ts";

const validType = ["category", "brand", "product"] as const;

const Details = () => {
    const [searchParams] = useSearchParams();
    const {id} = useParams();

    const pageType = searchParams.get("type") as typeof validType[number];

    if (!validType.includes(pageType) || isNaN(Number(id))) {
        return <NotFoundPage/>
    }

    return (
        <Container maxW='7xl'>
            <Card>
                <CardBody>
                    {pageType === "category" && <CategoryDetails id={Number(id)}/>}
                </CardBody>
            </Card>
        </Container>
    )
};

const CategoryDetails = ({id}: { id: number }) => {
    const [value, setValue] = useState('')

    const {data, isLoading} = useCategory(id);

    const {isOpen, onOpen, onClose} = useDisclosure();

    const cancelRef = useRef(null);

    const mutation = useCategoryCUD();

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setValue(data.name);
        }
    }, [data])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)

    const handleDeleteCategory = async () => {
        await mutation.mutateAsync({
            type: "DELETE",
            id: id,
            pushOnSuccess: "/inventory?pageSize=10&tab=2",

        });
    }

    const handleUpdateCategory = async () => {
        await mutation.mutateAsync({
            type: "UPDATE",
            id: id,
            name: value
        });
    }

    const handleCreateCategory = async () => {
        const result = await mutation.mutateAsync({
            type: "CREATE",
            name: value
        })
        if (result) {
            navigate(`/inventory/${result.id}?type=category`)
        }
    }

    if (isLoading) {
        return <Center><AntdSpin/></Center>
    }

    if (!data && id !== 0) return <p>Product not found</p>;

    return (
        <>
            <Text mb='8px'>Category Name</Text>
            <Input
                value={value}
                onChange={handleChange}
                placeholder='Category name'
            />
            <br/>
            <br/>
            <Flex justify='space-between'>
                {id === 0 ? (
                    <Button
                        leftIcon={<BiSave/>}
                        variant='solid'
                        colorScheme='blue'
                        isDisabled={value.trim().length === 0}
                        onClick={handleCreateCategory}
                        isLoading={mutation.isLoading}
                    >
                        Add
                    </Button>
                ) : data && (
                    <>
                        <Button
                            leftIcon={<BiSave/>}
                            variant='solid'
                            colorScheme='blue'
                            isDisabled={data.name === value || value.trim().length === 0}
                            onClick={handleUpdateCategory}
                            isLoading={mutation.isLoading}
                        >
                            Save
                        </Button>
                        <Button
                            leftIcon={<DeleteIcon/>}
                            variant='outline'
                            colorScheme='red'
                            onClick={onOpen}
                        >
                            Delete
                        </Button>
                    </>
                )}
            </Flex>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete category
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Highlight query='All the related products will be deleted too'
                                       styles={{
                                           px: '1',
                                           py: '1',
                                           bg: "red.700",
                                           color: "white",
                                       }}>
                                Are you sure? All the related products will be deleted too.
                            </Highlight>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleDeleteCategory} ml={3}
                                    isLoading={mutation.isLoading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default Details;