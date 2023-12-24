import { Box, Center, Text, useColorModeValue } from '@chakra-ui/react';
import { ReviewItem } from './ReviewItem.tsx';
import { useParams } from 'react-router-dom';
import { useReviews } from '../hooks/queries/useReviews.ts';
import AntdSpin from './AntdSpin';
import { useAuth } from '../context/AuthContext.tsx';
import { useMyReview } from '../hooks/queries/useMyReview.ts';
import { memo, useEffect, useState } from 'react';
import { useIsVisible } from '../hooks/useIsVisible.ts';

type Props = {
    firstPageOnly?: boolean;
};

export const Reviews = memo(({ firstPageOnly }: Props) => {
    const { id } = useParams();
    const { user } = useAuth();

    const [lastElementRef, setLastElementRef] = useState<Element | null>(null);
    const isVisible = useIsVisible(lastElementRef);

    const { data, status, isFetchingNextPage, hasNextPage, isLoading, isFetching, fetchNextPage } = useReviews(id);

    useEffect(() => {
        if (isVisible && hasNextPage && !isFetchingNextPage) void fetchNextPage();
    }, [isVisible]);

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
            {!hasNextPage && reviews.length >= 10 && (
                <Center>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>No more reviews available.</Text>
                </Center>
            )}
            {(isFetchingNextPage || isFetching || isLoading) && (
                <Center>
                    <AntdSpin />
                </Center>
            )}
            <div ref={setLastElementRef} />
        </>
    );
});
