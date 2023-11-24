import { Box } from '@chakra-ui/react';
import { ReviewItem } from './ReviewItem.tsx';
import { useParams } from 'react-router-dom';
import { useReviews } from '../hooks/queries/useReviews.ts';

export const Reviews = () => {
    const { id } = useParams();

    const { data } = useReviews(id);

    return (
        <Box>
            {Array.isArray(data) &&
                data.map((review, index) => (
                    <Box key={index} my={7}>
                        <ReviewItem data={review} />
                    </Box>
                ))}
        </Box>
    );
};
