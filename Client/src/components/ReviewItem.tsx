import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Avatar,
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
import { CiMenuKebab } from 'react-icons/ci';
import { Review } from '../types/review.ts';
import { useRef, useState } from 'react';
import { useReviewCUD } from '../hooks/mutations/useReviewCUD.ts';

type Props = {
    data: Review;
    ownByUser?: boolean;
};

export const ReviewItem = ({ data, ownByUser }: Props) => {
    const { review, rating, userName, userProfilePicture, updatedAt, productId } = data;
    const [ratingValue, setRatingValue] = useState(String(rating));
    const [reviewValue, setReviewValue] = useState(review);

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
                    review: reviewValue,
                    productId: productId,
                    rating: Number(ratingValue),
                },
            })
            .then(() => {
                onClose();
            });
    };

    return (
        <Box maxWidth="xl">
            <Flex justifyContent="space-between">
                <HStack>
                    <Avatar size={'sm'} src={userProfilePicture} />
                    <Text>{userName}</Text>
                </HStack>
                {ownByUser && (
                    <>
                        <Menu>
                            <MenuButton as={IconButton} icon={<CiMenuKebab />} variant="ghost" />
                            <MenuList>
                                <MenuItem onClick={onOpen}>Edit</MenuItem>
                                <MenuItem onClick={onDeleteOpen}>Delete</MenuItem>
                            </MenuList>
                        </Menu>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Edit review</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Text mb={2}>Rating</Text>
                                    <RadioGroup value={ratingValue} onChange={setRatingValue}>
                                        <HStack spacing="24px">
                                            <Radio value="1">1</Radio>
                                            <Radio value="2">2</Radio>
                                            <Radio value="3">3</Radio>
                                            <Radio value="4">4</Radio>
                                            <Radio value="5">5</Radio>
                                        </HStack>
                                    </RadioGroup>
                                    <br />
                                    <Text mb={2}>Comment</Text>
                                    <Textarea
                                        minHeight="sm"
                                        placeholder="Your comment"
                                        value={reviewValue}
                                        onChange={(e) => setReviewValue(e.target.value)}
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={handleEditReview}
                                        isDisabled={!review.trim()}
                                        isLoading={mutation.isLoading}
                                    >
                                        Save changes
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                            <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                        Delete review
                                    </AlertDialogHeader>
                                    <AlertDialogBody>Are you sure?</AlertDialogBody>
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
                <Text fontWeight="light" color={useColorModeValue('gray.600', 'gray.400')}>
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
