import { Button, Image, Input, Text } from '@chakra-ui/react';
import placeholderImg from '../assets/placeholderImage.webp';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

type Props = {
    src?: string;
    onInputChange: (files: FileList) => void;
};

export const ImageInputWithPreview = ({ src, onInputChange }: Props) => {
    const [preview, setPreview] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files?.length) {
            setPreview(URL.createObjectURL(files[0]));
            onInputChange(files);
        }
    };

    useEffect(() => {
        return () => {
            preview && URL.revokeObjectURL(preview);
        };
    }, []);

    return (
        <>
            <Image
                src={preview || src}
                fallbackSrc={placeholderImg}
                height="150px"
                rounded="xl"
                aspectRatio="4/3"
                objectFit="cover"
            />
            <Button size="sm" variant="ghost" colorScheme="blue" onClick={() => inputRef.current?.click()}>
                Select image
            </Button>
            <Input
                type="file"
                accept="image/*"
                multiple={false}
                name="picture"
                onChange={onChange}
                ref={inputRef}
                hidden
            />
            {!!preview && (
                <Text fontSize="xs">
                    "Note: Image updates may take up to 5 minutes to reflect in the UI due to caching."
                </Text>
            )}
        </>
    );
};
