import {
    Button,
    HStack,
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
import { useReviewCUD } from '../hooks/mutations/useReviewCUD.ts';
import { useState } from 'react';

type Props = {
    productId: number;
};

export const WriteAReviewModalButton = ({ productId }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ratingInput, setRatingInput] = useState('5');
    const [reviewInput, setReviewInput] = useState('');

    const mutation = useReviewCUD();

    const handleSubmitReview = async () => {
        await mutation
            .mutateAsync({
                type: 'CREATE',
                payload: {
                    rating: Number(ratingInput),
                    review: reviewInput,
                    productId,
                },
            })
            .then(() => {
                onClose();
                setReviewInput('');
                setReviewInput('5');
            });
    };

    const handleCancel = () => {
        setReviewInput('');
        setRatingInput('5');
        onClose();
    };

    return (
        <>
            <Button variant="solid" colorScheme="blue" onClick={onOpen}>
                Write a review
            </Button>
            <Modal isOpen={isOpen} onClose={handleCancel}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Write a review</ModalHeader>
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
                        <Text textAlign="right" color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
                            {reviewInput.length}/500
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Button mr={3} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={handleSubmitReview}
                                isDisabled={!reviewInput.trim()}
                                isLoading={mutation.isLoading}
                            >
                                Post
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
