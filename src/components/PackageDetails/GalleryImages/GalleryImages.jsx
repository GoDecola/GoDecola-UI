import "./GalleryImages.css";
import CarouselPackageDetails from "../../../components/PackageDetails/Carousel/CarouselPackageDetails";
import { useState, useEffect, useRef } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import useScrollArrows from "../../../hooks/useScrollArrows";
import useIsMobile from "../../../hooks/useIsMobile";
import HeartButton from "../../HearthButton/HearthButton";

const GalleryImages = ({ packageData }) => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  const arrowsRef = useRef(null);
  const arrows = useScrollArrows(arrowsRef);

  const scrollCarousel = (direction, ref) => {
    if (!ref.current) return;

    const scrollAmount = isMobile ? 300 : 400;

    ref.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!arrowsRef.current) return;

      const container = arrowsRef.current;
      const imageWidth = container.clientWidth;
      const index = Math.round(container.scrollLeft / imageWidth);

      setCurrentIndex(index);
    };

    const refCopy = arrowsRef.current;
    refCopy.addEventListener("scroll", handleScroll);

    return () => {
      refCopy.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToIndex = (index) => {
    if (!arrowsRef.current) return;

    const container = arrowsRef.current;
    const imageWidth = container.clientWidth;
    const targetScrollLeft = index * imageWidth;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });

    setCurrentIndex(index);
  };

  return (
    <div className="galleryImages-container">
      {packageData?.mediasUrl?.length > 0 && (
        <div className="galleryCarousel-wrapper">
          <div
            style={{
              transform: "scale(1.6)",
              alignSelf: "flex-end",
              marginRight: "10px",
            }}
          >
            <HeartButton packageId={packageData.id} />
          </div>
          <div className="galleryCarousel-container">
            <CarouselPackageDetails packageData={packageData} ref={arrowsRef} />
          </div>
          {!isMobile && (
            <div className="galleryArrowsDots">
              {arrows.left && (
                <div
                  className="galleryCarousel-arrow-left"
                  onClick={() => scrollCarousel("left", arrowsRef)}
                >
                  <FaArrowAltCircleLeft />
                </div>
              )}
              {arrows.right && (
                <div
                  className="galleryCarousel-arrow-right"
                  onClick={() => scrollCarousel("right", arrowsRef)}
                >
                  <FaArrowAltCircleRight />
                </div>
              )}
              <div className="galleryPaginationDots">
                {packageData.mediasUrl.map((media, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => scrollToIndex(index)}
                    aria-label={`Ir para ${
                      media.mediaType === "imagem" ? "imagem" : "vídeo"
                    } ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryImages;
