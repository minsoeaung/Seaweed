import Slider from "react-slick";
import {useState} from "react";
import {Box, IconButton, Image, useBreakpointValue} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import placeholderImage from '../assets/placeholderImage.webp';

const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: false,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
}

type Props = {
    imgHeight: string;
    images: string[]
}

export const ImageSlider = ({imgHeight, images = []}: Props) => {
    const [slider, setSlider] = useState<Slider | null>(null)

    const top = useBreakpointValue({base: '90%', md: '50%'})
    const side = useBreakpointValue({base: '30%', md: '10px'})

    return (
        <Box width="full" height="full" position="relative" overflow="hidden">
            {/* CSS files for react-slick */}
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
            />
            {images.length > 0 && (
                <>
                    <IconButton
                        aria-label="left-arrow"
                        colorScheme="messenger"
                        borderRadius="full"
                        position="absolute"
                        left={side}
                        top={top}
                        transform={'translate(0%, -50%)'}
                        zIndex={2}
                        onClick={() => slider?.slickPrev()}>
                        <ChevronLeftIcon/>
                    </IconButton>
                    <IconButton
                        aria-label="right-arrow"
                        colorScheme="messenger"
                        borderRadius="full"
                        position="absolute"
                        right={side}
                        top={top}
                        transform={'translate(0%, -50%)'}
                        zIndex={2}
                        onClick={() => slider?.slickNext()}>
                        <ChevronRightIcon/>
                    </IconButton>
                </>
            )}
            {/* Slider */}
            <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {images.length > 0 ? (
                    images.map((url, index) => (
                        <Image src={url} rounded="xl" height={imgHeight} key={index} objectFit="cover"
                               objectPosition="center"
                               fallbackSrc={placeholderImage}
                               width="full"/>
                    ))
                ) : (
                    <Image src={placeholderImage} rounded="xl" height={imgHeight} objectFit="cover"
                           objectPosition="center"
                           width="full"
                    />
                )}
            </Slider>
        </Box>
    )
}