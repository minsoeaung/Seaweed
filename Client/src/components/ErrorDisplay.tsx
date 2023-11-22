import { Alert, AlertDescription, AlertIcon, AlertTitle, VStack } from '@chakra-ui/react';
import { ApiError } from '../types/apiError.ts';

export const ErrorDisplay = ({ error }: { error: ApiError }) => {
    return (
        <Alert status="error">
            <AlertIcon />
            <VStack alignItems="start" spacing={0}>
                <AlertTitle>{error?.title || 'Something went wrong'}</AlertTitle>
                {error?.detail ? (
                    <AlertDescription>{error.detail}</AlertDescription>
                ) : !!error?.errors ? (
                    Object.keys(error.errors).map((key) => {
                        const errors = error.errors![key];
                        return errors.map((error) => <AlertDescription>{error}</AlertDescription>);
                    })
                ) : null}
            </VStack>
        </Alert>
    );
};
