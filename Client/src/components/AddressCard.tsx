import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { AddressDetails } from '../types/addressDetails.ts';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useAddressCUD } from '../hooks/mutations/useAddressCUD.tsx';

type Props = {
    data: AddressDetails;
    // addressIdToDelete: MutableRefObject<number>;
    // openDeleteAlertDialog: () => void;
};

export const AddressCard = ({ data }: Props) => {
    const deleteAddressMutation = useAddressCUD();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);

    const handleDeleteAddress = async () => {
        await deleteAddressMutation
            .mutateAsync({
                type: 'DELETE',
                id: data.id,
            })
            .then(onClose);
    };

    return (
        <>
            <Card variant="elevated" width={{ base: 'xs', md: 'md' }} position="relative" height="100%">
                <Text color="orange.500" position="absolute" right={2} top={1}>
                    {data.isDefault && 'Default address'}
                </Text>
                <CardBody>
                    <Text>{`${data.unitNumber}, ${data.streetNumber}`}</Text>
                    <Text>{data.addressLine1}</Text>
                    <Text>{data.addressLine2}</Text>
                    <Text>{`${data.city}, ${data.region}`}</Text>
                    <Text>{data.postalCodes}</Text>
                    <Text>{data.country.name}</Text>
                </CardBody>
                <ButtonGroup isAttached variant="ghost" colorScheme="blue" spacing="6">
                    <Button as={Link} to={`/user/my-account/edit-address?id=${data.id}`}>
                        Edit
                    </Button>
                    <Button onClick={onOpen}>Delete</Button>
                </ButtonGroup>
            </Card>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete shipping address
                        </AlertDialogHeader>
                        <AlertDialogBody>Confirm deleting shipping address</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteAddress}
                                ml={3}
                                isLoading={deleteAddressMutation.isLoading}
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
