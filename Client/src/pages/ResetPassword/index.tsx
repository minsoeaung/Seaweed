import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormHelperText,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useResetPassword } from '../../hooks/mutations/useResetPassword.ts';
import { ErrorDisplay } from '../../components/ErrorDisplay.tsx';
import { ApiError } from '../../types/apiError.ts';

const ResetPassword = () => {
    const [success, setSuccess] = useState(false);

    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const token = params.get('token');

    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmedPasswordRef = useRef<HTMLInputElement>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const mutation = useResetPassword();
    const toast = useToast();

    if (!email || !token) {
        return <p>Email or Token is missing.</p>;
    }

    const resetPassword = async () => {
        const newPassword = newPasswordRef.current?.value || '';
        const confirmedPassword = confirmedPasswordRef.current?.value || '';

        if (newPassword.length < 6) {
            toast({
                title: 'Password must have a minimum length of 6.',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        if (newPassword !== confirmedPassword) {
            toast({
                title: 'The entered password and confirmed password do not match.',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        await mutation
            .mutateAsync({
                token,
                email,
                newPassword,
            })
            .then(() => setSuccess(true));
    };

    return (
        <Box maxW="xl" mx="auto">
            <Card>
                <CardHeader>
                    <Heading fontSize="2xl">Reset your password</Heading>
                </CardHeader>
                <CardBody>
                    {success ? (
                        <Alert
                            status="success"
                            variant="subtle"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                        >
                            <AlertIcon boxSize="40px" mr={0} />
                            <AlertTitle mt={4} mb={1} fontSize="lg">
                                Password Reset Successful!
                            </AlertTitle>
                            <AlertDescription maxWidth="sm">
                                Your password has been successfully updated. You can now log in using your new password.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <VStack spacing={6}>
                                <FormControl>
                                    <InputGroup size="md">
                                        <Input
                                            ref={newPasswordRef}
                                            pr="4.5rem"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter new password"
                                        />
                                        <InputRightElement width="4.5rem">
                                            <Button
                                                h="1.75rem"
                                                size="sm"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormHelperText>Minimum 6 characters.</FormHelperText>
                                </FormControl>
                                <InputGroup size="md">
                                    <Input
                                        ref={confirmedPasswordRef}
                                        pr="4.5rem"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm new password"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button
                                            h="1.75rem"
                                            size="sm"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? 'Hide' : 'Show'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </VStack>
                            {!!mutation.error && (
                                <>
                                    <br />
                                    <Box>
                                        <ErrorDisplay error={mutation.error as ApiError} />
                                    </Box>
                                </>
                            )}
                            <Button
                                mt={8}
                                variant="solid"
                                colorScheme="blue"
                                w="full"
                                onClick={resetPassword}
                                isLoading={mutation.isLoading}
                            >
                                Reset password
                            </Button>
                        </>
                    )}
                </CardBody>
            </Card>
        </Box>
    );
};

export default ResetPassword;
