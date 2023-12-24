import { Icon, IconButton, IconButtonProps, LightMode } from '@chakra-ui/react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useToggleWishList } from '../../hooks/mutations/useToggleWishList.ts';

type Props = {
    isChecked: boolean;
    productId: number;
    iconButtonProps: IconButtonProps;
};

export const FavouriteButton = ({ isChecked, productId, iconButtonProps }: Props) => {
    const mutation = useToggleWishList();

    return (
        <LightMode>
            <IconButton
                isRound
                bg="white"
                color="gray.900"
                size="sm"
                _hover={{ transform: 'scale(1.1)' }}
                sx={{ ':hover > svg': { transform: 'scale(1.1)' } }}
                transition="all 0.15s ease"
                icon={
                    <Icon
                        as={isChecked ? AiFillHeart : AiOutlineHeart}
                        transition="all 0.15s ease"
                        color={isChecked ? 'red' : ''}
                    />
                }
                boxShadow="base"
                {...iconButtonProps}
                onClick={async (e) => {
                    e.stopPropagation();
                    
                    await mutation.mutateAsync({
                        type: isChecked ? 'REMOVE' : 'ADD',
                        productId,
                    });
                }}
                isLoading={mutation.isLoading}
            />
        </LightMode>
    );
};
