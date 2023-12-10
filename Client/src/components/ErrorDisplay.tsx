import { Alert, AlertDescription, AlertIcon, AlertTitle, ListItem, UnorderedList, VStack } from '@chakra-ui/react';
import { ApiError } from '../types/apiError.ts';

export const ErrorDisplay = ({ error }: { error: ApiError }) => {
    return (
        <Alert status={error.status === 500 ? 'error' : 'warning'} alignItems="start">
            <AlertIcon />
            <VStack alignItems="start" spacing={0}>
                <AlertTitle>{error?.title || 'Something went wrong'}</AlertTitle>
                <UnorderedList>
                    {error?.detail ? (
                        <ListItem>
                            <AlertDescription overflowWrap="break-word">{error.detail}</AlertDescription>
                        </ListItem>
                    ) : !!error?.errors ? (
                        Object.keys(error.errors).map((key) => {
                            const errors = error.errors![key];
                            return errors.map((error) => (
                                <ListItem>
                                    <AlertDescription overflowWrap="break-word">{error}</AlertDescription>
                                </ListItem>
                            ));
                        })
                    ) : null}
                </UnorderedList>
            </VStack>
        </Alert>
    );
};
