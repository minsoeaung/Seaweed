import Slider from "react-slick";
import {useState} from "react";
import {Box, IconButton, Image} from "@chakra-ui/react";
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
                        colorScheme="whiteAlpha"
                        borderRadius="full"
                        position="absolute"
                        left='10px'
                        top='50%'
                        transform={'translate(0%, -50%)'}
                        zIndex={2}
                        onClick={() => slider?.slickPrev()}>
                        <ChevronLeftIcon color='gray.700' fontSize='2xl'/>
                    </IconButton>
                    <IconButton
                        aria-label="right-arrow"
                        colorScheme="whiteAlpha"
                        borderRadius="full"
                        position="absolute"
                        right='10px'
                        top='50%'
                        transform={'translate(0%, -50%)'}
                        zIndex={2}
                        onClick={() => slider?.slickNext()}>
                        <ChevronRightIcon color='gray.700' fontSize='2xl'/>
                    </IconButton>
                </>
            )}
            {/* Slider */}
            <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {images.length > 0 ? (
                    images.map((url, index) => (
                        <Image src={url} height={imgHeight} key={index} objectFit="cover"
                               objectPosition="center"
                               fallbackSrc={placeholderImage}
                               width="full"/>
                    ))
                ) : (
                    <Image src={placeholderImage} height={imgHeight} objectFit="cover"
                           objectPosition="center"
                           width="full"
                    />
                )}
            </Slider>
        </Box>
    )
}