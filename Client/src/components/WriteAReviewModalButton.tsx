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
    useDisclosure,
} from '@chakra-ui/react';
import { useReviewCUD } from '../hooks/mutations/useReviewCUD.ts';
import { useState } from 'react';

type Props = {
    productId: number;
};

export const WriteAReviewModalButton = ({ productId }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [rating, setRating] = useState('5');
    const [review, setReview] = useState('');

    const mutation = useReviewCUD();

    const handleSubmitReview = async () => {
        await mutation
            .mutateAsync({
                type: 'CREATE',
                payload: {
                    rating: Number(rating),
                    review,
                    productId,
                },
            })
            .then(() => {
                onClose();
                setReview('');
                setReview('5');
            });
    };

    return (
        <>
            <Button variant="solid" colorScheme="blue" onClick={onOpen}>
                Write a review
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxWidth={{ base: '95%', md: 'md' }}>
                    <ModalHeader>Write a review</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={2}>Rating</Text>
                        <RadioGroup value={rating} onChange={setRating}>
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
                            placeholder="Your comment"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            height="25vh"
                            maxLength={500}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handleSubmitReview}
                            isDisabled={!review.trim()}
                            isLoading={mutation.isLoading}
                        >
                            Submit review
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
