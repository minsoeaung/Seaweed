import {Icon, IconButton, IconButtonProps, LightMode} from "@chakra-ui/react";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import {useToggleWishList} from "../../hooks/mutations/useToggleWishList.ts";

type Props = {
    isChecked: boolean;
    productId: number;
} & IconButtonProps;

export const FavouriteButton = (props: Props) => {
    const mutation = useToggleWishList();
    const {isChecked, productId} = props;

    return (
        <LightMode>
            <IconButton
                isRound
                bg="white"
                color="gray.900"
                size="sm"
                _hover={{transform: 'scale(1.1)'}}
                sx={{':hover > svg': {transform: 'scale(1.1)'}}}
                transition="all 0.15s ease"
                icon={<Icon as={props.isChecked ? AiFillHeart : AiOutlineHeart}
                            transition="all 0.15s ease" color={isChecked ? "red" : ""}/>}
                boxShadow="base"
                {...props}
                onClick={async () => {
                    await mutation.mutateAsync({
                        type: isChecked ? "REMOVE" : "ADD",
                        productId
                    })
                }}
                isLoading={mutation.isLoading}
            />
        </LightMode>
    )
}