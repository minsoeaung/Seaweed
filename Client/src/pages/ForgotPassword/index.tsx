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
    Heading,
    Input,
    Text,
} from '@chakra-ui/react';
import { useSendResetPasswordMail } from '../../hooks/mutations/useSendResetPasswordMail.ts';
import { FormEvent, useRef, useState } from 'react';
import { ErrorDisplay } from '../../components/ErrorDisplay.tsx';
import { ApiError } from '../../types/apiError.ts';

const ForgotPassword = () => {
    const [sent, setSent] = useState(false);

    const mutation = useSendResetPasswordMail();
    const emailRef = useRef<HTMLInputElement>(null);

    const sendMail = async (e: FormEvent) => {
        e.preventDefault();

        if (emailRef.current) {
            await mutation
                .mutateAsync({
                    clientUrl: window.location.origin + '/reset-password',
                    email: emailRef.current.value,
                })
                .then(() => setSent(true));
        }
    };

    return (
        <Box maxW="xl" mx="auto">
            <Card>
                <CardHeader>
                    <Heading fontSize="3xl">Forgot password?</Heading>
                </CardHeader>
                <CardBody>
                    {sent ? (
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
                                Password Reset Email Sent
                            </AlertTitle>
                            <AlertDescription maxWidth="sm">
                                A link has been sent to your email address. Please check your inbox and follow the link
                                to reset your password.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <Text>
                                Enter the email address associated with your account, and we'll send you a link to reset
                                your password.
                            </Text>
                            <br />
                            <form onSubmit={sendMail}>
                                <FormControl>
                                    <Input ref={emailRef} required type="email" placeholder="Your account's email" />
                                </FormControl>
                                {!!mutation.error && (
                                    <>
                                        <br />
                                        <Box>
                                            <ErrorDisplay error={mutation.error as ApiError} />
                                        </Box>
                                    </>
                                )}
                                <Button
                                    variant="solid"
                                    colorScheme="blue"
                                    mt={4}
                                    type="submit"
                                    loadingText="Submitting..."
                                    isLoading={mutation.isLoading}
                                >
                                    Submit
                                </Button>
                            </form>
                        </>
                    )}
                </CardBody>
            </Card>
        </Box>
    );
};

export default ForgotPassword;
