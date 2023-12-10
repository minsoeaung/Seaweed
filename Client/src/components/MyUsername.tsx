import { ButtonGroup, HStack, IconButton, Input, Text, VStack } from '@chakra-ui/react';
import { useMyAccount } from '../hooks/queries/useMyAccount.ts';
import { FaRegCircleUser } from 'react-icons/fa6';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useUpdateUsername } from '../hooks/mutations/useUpdateUsername.ts';
import React, { memo, useEffect, useState } from 'react';
import { ErrorDisplay } from './ErrorDisplay.tsx';
import { ApiError } from '../types/apiError.ts';

export const MyUsername = memo(() => {
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState('');

    const { data } = useMyAccount();

    const mutation = useUpdateUsername();

    const handleUpdate = async () => {
        await mutation.mutateAsync(username).then(() => {
            setEditMode(false);
        });
    };

    const handleCancel = () => {
        setUsername(data?.userName || '');
        setEditMode(false);
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await handleUpdate();
        }
    };

    useEffect(() => {
        if (data) {
            setUsername(data.userName);
        }
    }, [data]);

    if (!data) return null;

    return (
        <VStack align="start">
            <HStack alignItems="center">
                <FaRegCircleUser />
                <Text fontWeight="bold">Username</Text>
            </HStack>
            {editMode ? (
                <VStack align="start">
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKeyDown} />
                    <ButtonGroup justifyContent="center" size="sm">
                        <IconButton
                            aria-label="Save changes"
                            icon={<CheckIcon />}
                            onClick={handleUpdate}
                            isLoading={mutation.isLoading}
                        />
                        <IconButton
                            aria-label="Cancel changes"
                            icon={<CloseIcon />}
                            onClick={handleCancel}
                            isDisabled={mutation.isLoading}
                        />
                    </ButtonGroup>
                </VStack>
            ) : (
                <HStack>
                    <Text>{data.userName}</Text>
                    <IconButton
                        aria-label="Edit username"
                        variant="ghost"
                        size="sm"
                        icon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                    />
                </HStack>
            )}
            {!!mutation.error && editMode && <ErrorDisplay error={mutation.error as ApiError} />}
        </VStack>
    );
});
