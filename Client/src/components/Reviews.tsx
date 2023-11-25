import { Box, Button, Center, Spinner, Text } from '@chakra-ui/react';
import { ReviewItem } from './ReviewItem.tsx';
import { useParams } from 'react-router-dom';
import { useReviews } from '../hooks/queries/useReviews.ts';
import AntdSpin from './AntdSpin';
import { useAuth } from '../context/AuthContext.tsx';
import { useMyReview } from '../hooks/queries/useMyReview.ts';

type Props = {
    firstPageOnly?: boolean;
};

export const Reviews = ({ firstPageOnly }: Props) => {
    const { id } = useParams();
    const { user } = useAuth();

    const { data, status, isFetchingNextPage, hasNextPage, isFetching, fetchNextPage } = useReviews(id);

    const { data: myReview } = useMyReview(id);

    const reviews =
        data?.pages
            .slice(0, firstPageOnly ? 1 : undefined)
            .flatMap((r) => r.results)
            .filter((r) => r.userId !== user?.id) || [];

    return status === 'loading' ? (
        <Center my={8}>
            <AntdSpin />
        </Center>
    ) : status === 'error' ? (
        <Center>
            <p>Error loading reviews.</p>
        </Center>
    ) : (
        <>
            {!firstPageOnly && myReview && (
                <Box my={7}>
                    <ReviewItem data={myReview} ownByUser />
                </Box>
            )}
            {reviews.map((review) => (
                <Box key={`${review.userId}-${review.productId}`} my={7}>
                    <ReviewItem data={review} />
                </Box>
            ))}
            {reviews.length === 0 && !myReview && (
                <Center my={7}>
                    <Text>This product has not been reviewed yet.</Text>
                </Center>
            )}
            {!firstPageOnly && reviews.length >= 10 && (
                <>
                    <Center>
                        <Button onClick={() => fetchNextPage()} isDisabled={!hasNextPage || isFetchingNextPage}>
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : hasNextPage
                                  ? 'Load More'
                                  : 'Nothing more to load'}
                        </Button>
                    </Center>
                    <Center py={5}>{isFetching && !isFetchingNextPage ? <Spinner /> : null}</Center>
                </>
            )}
        </>
    );
};
