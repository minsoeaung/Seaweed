import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ErrorDisplay } from './ErrorDisplay.tsx';
import { ApiError } from '../types/apiError.ts';
import { useRef, useState } from 'react';
import { useDeleteAccount } from '../hooks/mutations/useDeleteAccount.ts';

export const MyDeleteAccount = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);

    const cancelRef = useRef(null);

    const deleteAccountMutation = useDeleteAccount();

    const handleDeleteAccount = async () => {
        await deleteAccountMutation.mutateAsync(password);
    };

    return (
        <>
            <Button leftIcon={<DeleteIcon />} variant="ghost" p={0} colorScheme="red" onClick={onOpen}>
                Delete Account
            </Button>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Account?
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <VStack align="start">
                                <Text>You will lose all of your data. This action cannot be reversed.</Text>
                                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                                    Please enter your password below...
                                </Text>
                                <InputGroup size="md">
                                    <Input
                                        placeholder="Your password"
                                        pr="4.5rem"
                                        type={show ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                                            {show ? 'Hide' : 'Show'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {!!deleteAccountMutation.error && (
                                    <ErrorDisplay error={deleteAccountMutation.error as ApiError} />
                                )}
                            </VStack>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteAccount}
                                ml={3}
                                isLoading={deleteAccountMutation.isLoading}
                                isDisabled={!password}
                            >
                                Delete Account
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};
