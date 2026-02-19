import { Typography, IconButton } from "@mui/material";
import "./carousel.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getCities, getCityImageUrl } from "../services/myCities";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

//clicking on the image will take it to the single city page for that city
//do I need to move the title?
//create peek of other items in the slideshow to the left and the right

//move buttons outside of image

function carousel() {
  const theme = useTheme();

  const swiperWrappedRef = useRef(null);
  function adjustMargin() {
    const screenWidth = window.innerWidth;

    if (swiperWrappedRef.current) {
      swiperWrappedRef.current.style.marginLeft =
        screenWidth <= 520
          ? "0px"
          : screenWidth <= 650
            ? "-50px"
            : screenWidth <= 800
              ? "-100px"
              : "-150px";
    }
  }

  useEffect(() => {
    adjustMargin();
    window.addEventListener("resize", adjustMargin);
    return () => window.removeEventListener("resize", adjustMargin);
  }, []);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  function getRandomSlides(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const data = await getCities();
        setSlides(getRandomSlides(data, 4));
      } catch (err) {
        console.error('Failed to fetch cities for carousel:', err.message);
      }
    }
    fetchSlides();
  }, []);

  return (
    <>
      <main>
        <div className="container">
          <IconButton
            ref={prevRef}
            aria-label="Previous slide"
            size="small"
            sx={{
              position: "absolute",
              top: "50%",
              left: "3%",
              transform: "translateY(-50%)",
              zIndex: 10,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",

              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                transform: "translateY(-50%) scale(1.1)",
                boxShadow: "0px 6px 12px rgba(0,0,0,0.4)",
              },
            }}
          >
            <ArrowBackIosNewIcon
              sx={{
                color: "white",
              }}
              size="small"
            />
          </IconButton>

          <IconButton
            ref={nextRef}
            aria-label="Next slide"
            size="small"
            sx={{
              position: "absolute",
              top: "50%",
              right: "3%",
              transform: "translateY(-50%)",
              zIndex: 10,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                transform: "translateY(-50%) scale(1.1)",
                boxShadow: "0px 6px 12px rgba(0,0,0,0.4)",
              },
            }}
          >
            <ArrowForwardIosIcon
              sx={{
                color: "white",
              }}
              size="small"
            />
          </IconButton>
          <Swiper
            modules={[Pagination, Navigation]}
            grabCursor
            initialSlide={0}
            centeredSlides
            centeredSlidesBounds
            slidesPerView="auto"
            className="mySwiper"
            pagination={{ clickable: true }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            // breakpoints={{
            //     320: { spaceBetween: 40},
            //     650: { spaceBetween: 30},
            //     1000: { spaceBetween: 20},
            // }}
            // onSwiper={(swiper) =>{
            //     swiperWrappedRef.current = swiper.wrapperEl;
            // }}
            spaceBetween={10}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <img src={getCityImageUrl(slide.slug, 1)} alt={slide.title} />
                <div className="title">
                  <Typography variant="h2" color="primary">
                    {slide.title}
                  </Typography>
                </div>
                <div className="content">
                  <div className="text-box">
                    <Typography variant="body2" color="text">
                      {slide.subtitle}
                    </Typography>
                  </div>
                  <div className="footer">
                    <div className="category"></div>
                    {/* <button>
                                        <span className="label">More...</span>
                                    </button> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>
    </>
  );
}
export default carousel;
