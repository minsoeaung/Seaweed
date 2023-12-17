import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Avatar,
    Badge,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { Rating } from './Rating.tsx';
import { Review } from '../types/review.ts';
import { useRef, useState } from 'react';
import { useReviewCUD } from '../hooks/mutations/useReviewCUD.ts';
import { DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';

type Props = {
    data: Review;
    ownByUser?: boolean;
};

export const ReviewItem = ({ data, ownByUser }: Props) => {
    const { review, rating, userName, userProfilePicture, updatedAt, productId } = data;
    const [ratingInput, setRatingInput] = useState(String(rating));
    const [reviewInput, setReviewInput] = useState(review);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef(null);

    const mutation = useReviewCUD();

    const handleDelete = async () => {
        await mutation
            .mutateAsync({
                type: 'DELETE',
                productId: productId,
            })
            .then(() => {
                onDeleteClose();
            });
    };

    const handleEditReview = async () => {
        await mutation
            .mutateAsync({
                type: 'UPDATE',
                payload: {
                    review: reviewInput,
                    productId: productId,
                    rating: Number(ratingInput),
                },
            })
            .then(() => {
                onClose();
            });
    };

    return (
        <Box p={{ base: 2, md: 4 }}>
            <Flex justifyContent="space-between" align="center">
                <HStack>
                    <Avatar size={'sm'} src={userProfilePicture || undefined} />
                    <Text>{userName || '[Deleted account]'}</Text>
                    {ownByUser && (
                        <Badge colorScheme="blue" size={{ base: 'xs', md: 'md' }}>
                            * Your review
                        </Badge>
                    )}
                </HStack>
                {ownByUser && (
                    <>
                        <Menu autoSelect={false}>
                            <MenuButton
                                as={IconButton}
                                aria-label="Review actions"
                                icon={<HamburgerIcon />}
                                variant="ghost"
                                colorScheme="blue"
                                size={{ base: 'sm', md: 'md' }}
                            />
                            <MenuList>
                                <MenuItem onClick={onOpen} icon={<EditIcon />}>
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={onDeleteOpen} icon={<DeleteIcon />}>
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <Modal isOpen={isOpen} onClose={onClose} isCentered>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Edit review</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Text mb={2}>Rating</Text>
                                    <RadioGroup value={ratingInput} onChange={setRatingInput}>
                                        <HStack spacing="24px">
                                            <Radio value="1">1</Radio>
                                            <Radio value="2">2</Radio>
                                            <Radio value="3">3</Radio>
                                            <Radio value="4">4</Radio>
                                            <Radio value="5">5</Radio>
                                        </HStack>
                                    </RadioGroup>
                                    <br />
                                    <Text mb={2}>Review</Text>
                                    <Textarea
                                        placeholder="Excellent product!"
                                        value={reviewInput}
                                        onChange={(e) => setReviewInput(e.target.value)}
                                        maxLength={500}
                                        autoFocus
                                    />
                                    <Text
                                        textAlign="right"
                                        color={useColorModeValue('gray.600', 'gray.400')}
                                        fontSize="sm"
                                    >
                                        {reviewInput.length}/500
                                    </Text>
                                </ModalBody>

                                <ModalFooter>
                                    <Button
                                        colorScheme="blue"
                                        onClick={handleEditReview}
                                        isDisabled={!reviewInput.trim()}
                                        isLoading={mutation.isLoading}
                                    >
                                        Save changes
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        <AlertDialog
                            isOpen={isDeleteOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onDeleteClose}
                            isCentered
                        >
                            <AlertDialogOverlay>
                                <AlertDialogContent maxWidth={{ base: '95%', md: 'md' }}>
                                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                        Deleting your review
                                    </AlertDialogHeader>
                                    <AlertDialogBody>Are you sure you want to proceed?</AlertDialogBody>
                                    <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={onDeleteClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            colorScheme="red"
                                            onClick={handleDelete}
                                            ml={3}
                                            isLoading={mutation.isLoading}
                                        >
                                            Delete
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                    </>
                )}
            </Flex>
            <HStack mt={2} spacing={4}>
                <Rating max={5} defaultValue={rating} />
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    {new Date(updatedAt)
                        .toLocaleDateString('my-MM', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                        .split(', ')
                        .slice(1)
                        .join(', ')}
                </Text>
            </HStack>
            <Text mt={1} color={useColorModeValue('gray.700', 'gray.200')}>
                {review}
            </Text>
        </Box>
    );
};
