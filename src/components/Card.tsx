import React, { useState, useEffect } from "react"
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
  ind: any
  setSelectedCount: any
  selectedCount: any
}
const Card = ({
  item,
  active,
  setActive,
  activeIndex,
  setActiveIndex,
  ind,
  setSelectedCount,
  selectedCount,
}: Props) => {
  // const images = item?.img?.map((images: any, ind: any) => {
  //   return images
  // })
  return (
    <div className="card_big w-full flex items-center justify-center lg:block">
      <div className=" card_custom hidden lg:block p-3 cursor-pointer">
        <div
          className="h-5/5  w-full flex items-center justify-center"
        >
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
            }}
            onActiveIndexChange={(e) => {
              item.activeIndex = e.realIndex
              setActiveIndex(e.realIndex)
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper mb-10"
          >
            {item?.img?.map((images: any, ind: any) => (
              <SwiperSlide className=" relative">
                <div
                  style={
                    images.selected
                      ? {
                          backgroundImage: "url('/images/inner_card_bg.png')",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }
                      : {
                          backgroundImage: "url('/images/inner_incative.png')",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }
                  }
                >
                  <img
                    onClick={() => {
                      if (
                        selectedCount.includes(images.img) &&
                        selectedCount.length > 0
                      ) {
                        images.selected = false
                        setActive(999)
                        setSelectedCount((selectedCount: any) =>
                          selectedCount.filter(
                            (index: any) => index !== images.img
                          )
                        )
                      } else if (selectedCount.length <= 4) {
                        images.selected = true
                        setSelectedCount([...selectedCount, images.img])
                      }

                      setActive({
                        id: item?.id,
                        img: item?.img[activeIndex],
                        title: item?.name,
                      })
                    }}
                    src={images?.img}
                    className=" p-4"
                    alt=""
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="  w-full flex items-center  justify-center">
          <p
            className={
              item.selected ? "active_card_text" : "text-white uppercase"
            }
            style={{marginBottom:"20px"}}
          >
            {item?.name}
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          setActive({
            id: item?.id,
            img: item?.img[activeIndex],
            title: item?.name,
          })
        }}
        className=" card_custom_mob block lg:hidden p-3"
      >
        <div
          style={
            active?.id === item?.id
              ? {
                  backgroundImage: "url('/images/inner_card_bg.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }
              : {
                  backgroundImage: "url('/images/inner_incative.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }
          }
          className=" h-4/5  w-full flex items-center justify-center"
        >
          <Swiper
            slidesPerView={1}
            // spaceBetween={30}
            loop={true}
            // pagination={{
            //   clickable: true,
            // }}
            onActiveIndexChange={(e) => {
              item.activeIndex = e.realIndex
              setActiveIndex(e.realIndex)
            }}
            // navigation={true}
            modules={[]}
            className="mySwiper mb-10 w-full flex items-center justify-center"
          >
            {item?.img?.map((images: any, ind: any) => (
              <SwiperSlide className=" relative">
                <img src={images} className=" p-4" alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="  w-full flex items-center  justify-center ">
          <p
            className={
              active?.id === item?.id
                ? "active_card_text"
                : "text-white uppercase"
            }
          >
            {item?.name}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Card
