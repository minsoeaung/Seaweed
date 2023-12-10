import { Box, Button, HStack, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useMyAccount } from '../hooks/queries/useMyAccount.ts';
import { useState } from 'react';
import { useSendVerificationMail } from '../hooks/mutations/useSendVerificationMail.ts';
import { TfiEmail } from 'react-icons/tfi';

export const MyEmail = () => {
    const { data } = useMyAccount();

    if (!data) return null;

    return (
        <VStack align="start">
            <HStack alignItems="center">
                <TfiEmail />
                <Text fontWeight="bold">Email</Text>
                {data.emailConfirmed && (
                    <Button as={Box} leftIcon={<CheckIcon />} size="xs" variant="ghost" colorScheme="green">
                        Verified
                    </Button>
                )}
            </HStack>
            <VStack align="start" spacing={0}>
                <Text>{data.email}</Text>
                {!data.emailConfirmed && <EmailUnverifiedWarning />}
            </VStack>
        </VStack>
    );
};

const EmailUnverifiedWarning = () => {
    const [mailSent, setMailSent] = useState(false);
    const sendEmailMutation = useSendVerificationMail();

    const sendVerifyToken = async () => {
        await sendEmailMutation.mutateAsync().then(() => setMailSent(true));
    };

    return (
        <HStack>
            <Text fontSize="0.8rem" color={useColorModeValue('gray.600', 'gray.400')}>
                {mailSent ? "We've sent a verification email. Please check your inbox." : 'Your email is not verified.'}
            </Text>
            {!mailSent && (
                <Button
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    textDecoration="underline"
                    onClick={sendVerifyToken}
                    isLoading={sendEmailMutation.isLoading}
                >
                    Send verification mail
                </Button>
            )}
        </HStack>
    );
};
