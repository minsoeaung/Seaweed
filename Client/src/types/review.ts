export type Review = {
    productId: number;
    userId: number;
    userName: string | null;
    userProfilePicture: string | null;

    rating: number;
    review: string;
    createdAt: Date;
    updatedAt: Date;
};
