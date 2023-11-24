export type Review = {
    productId: number;
    userId: number;
    userName: string;
    userProfilePicture: string;

    rating: number;
    review: string;
    createdAt: Date;
    updatedAt: Date;
};
