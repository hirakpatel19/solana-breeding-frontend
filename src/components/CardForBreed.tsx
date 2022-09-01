import React from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// import required modules
import { Pagination, Navigation } from "swiper"
type Props = {
  item: any
  active: any
  setActive: any
  activeIndex: any
  setActiveIndex: any
}
const CardForBreed = ({
  item,
  active,
  setActive,
  activeIndex,
  setActiveIndex,
}: Props) => {
  return (
    <div className="card_big w-full  flex items-center relative h-96 xl:h-full  flex-col justify-center">
      
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        // pagination={{
        //   clickable: true,
        // }}
        onActiveIndexChange={(e) => {
          item.activeIndex = e.realIndex
          setActiveIndex(e.realIndex)
        }}
        // navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper mb-10"
      >
        {item?.map((images: any, ind: any) => (
          <>
            <SwiperSlide className=" relative">

              <img src={images?.img} className="relative top-0 z-10" alt="" />
            </SwiperSlide>
            
          </>
        ))}
      </Swiper>
      <div className=" w-full top-0  absolute  left-0  ">
        <img
          src="/images/preview_bg.png"
          className=" w-full   lg:object-contain"
          alt=""
        />
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        onActiveIndexChange={(e) => {
          item.activeIndex = e.realIndex
          setActiveIndex(e.realIndex)
        }}
        modules={[]}
        style={{height: "auto"}}
        className="mySwiper mb-10"
      >
        {item?.map((images: any, ind: any) => (
          <>
            <SwiperSlide className=" relative">
              <div className="text-center lg:-bottom-8  xl:-bottom-8  left-0 z-10 lg:text-lg xl:text-xl  pilot w-full text-white">
                {images?.name}
              </div>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
    </div>
  )
}

export default CardForBreed
