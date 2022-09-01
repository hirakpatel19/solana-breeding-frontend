import React, { useEffect, useState } from "react"
import Sidebar from "../layout/Sidebar"
import Topbar from "../layout/Topbar"
import { Swiper, SwiperSlide } from "swiper/react"
import { toast } from "react-toastify"
// import required modules
import { Pagination, Navigation } from "swiper"

import { mintTraits } from "contract/helper"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import ResizerImage from "../components/ResizerImage"

const TraitsMint = () => {
  const wallet = useWallet()
  const { connection } = useConnection()

  const [loading, setLoading] = useState(false)

  const [active, setActive] = useState(0)
  const [data, setData] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<any[]>([])

  const customData = [
    {
      img: "/images/layers/Armour/Alum10.png",
    },
    {
      img: "/images/layers/Background/Coruscant100.png",
    },
    {
      img: "/images/layers/Background/Cloak.png",
    },
  ]

  const cardFakeData = [
    {
      id: 1,
      img: [
        "/images/layers/Helmet/Alum.png",
        "/images/layers/Helmet/Ciridium.png",
        "/images/layers/Helmet/Cortosis.png",
        "/images/layers/Helmet/Dedrium.png",
        "/images/layers/Helmet/Frasium.png",
        "/images/layers/Helmet/Mullinane.png",
        "/images/layers/Helmet/Quadranium.png",
        "/images/layers/Helmet/Xonolite.png",
      ],
      name: "helmet",
    },
    {
      id: 2,
      img: [
        "/images/layers/Armour/Alum.png",
        "/images/layers/Armour/Ciridium.png",
        "/images/layers/Armour/Cortosis.png",
        "/images/layers/Armour/Dedrium.png",
        "/images/layers/Armour/Frasium.png",
        "/images/layers/Armour/Mullinane.png",
        "/images/layers/Armour/Quadranium.png",
        "/images/layers/Armour/Xonolite.png",
      ],
      name: "Armour",
    },
    {
      id: 3,
      img: [
        "/images/layers/Background/Concord Dawn.png",
        "/images/layers/Background/Coruscant.png",
        "/images/layers/Background/Desert Sea.png",
        "/images/layers/Background/Green Sunset.png",
        "/images/layers/Background/KASHYYYK.png",
        "/images/layers/Background/Malachor.png",
        "/images/layers/Background/Mandalore.png",
        "/images/layers/Background/Mos Eisley.png",
        "/images/layers/Background/PlanetSun.png",
        "/images/layers/Background/Spaceship Interior.png",
        "/images/layers/Background/Tatooine Sunset.png",
        "/images/layers/Background/Twin Suns.png",
      ],
      name: "Background",
    },
    {
      id: 4,
      img: [
        "/images/layers/Cloak/Cadmium White Damaged.png",
        "/images/layers/Cloak/Cadmium White.png",
        "/images/layers/Cloak/Ciridium Green.png",
        "/images/layers/Cloak/Cortosis Brown Damaged.png",
        "/images/layers/Cloak/Cortosis Brown.png",
        "/images/layers/Cloak/Dune Brown.png",
        "/images/layers/Cloak/Dune Brown Damaged.png",
        "/images/layers/Cloak/Mullinane Black Damaged.png",
        "/images/layers/Cloak/Mullinane Black.png",
        "/images/layers/Cloak/Xonolite Red Damaged.png",
        "/images/layers/Cloak/Xonolite Red.png",
      ],
      name: "Cloak",
    },
    {
      id: 5,
      img: [
        "/images/layers/hbelts/Blue.png",
        "/images/layers/hbelts/Red.png",
        "/images/layers/hbelts/Standard.png",
      ],
      name: "hbelts",
    },
    {
      id: 6,
      img: [
        "/images/layers/Helmet Accent/Duty.png",
        "/images/layers/Helmet Accent/Healing.png",
        "/images/layers/Helmet Accent/Honor.png",
        "/images/layers/Helmet Accent/Justice.png",
        "/images/layers/Helmet Accent/Loyalty.png",
        "/images/layers/Helmet Accent/Luck.png",
        "/images/layers/Helmet Accent/Passion.png",
        "/images/layers/Helmet Accent/Power.png",
        "/images/layers/Helmet Accent/Purity.png",
        "/images/layers/Helmet Accent/Redemption.png",
        "/images/layers/Helmet Accent/Reliability.png",
        "/images/layers/Helmet Accent/Vengeance.png",
      ],
      name: "Helmet Accent",
    },
    {
      id: 7,
      img: [
        "/images/layers/Helmet Damage/Buffed Out.png",
        "/images/layers/Helmet Damage/Experienced.png",
        "/images/layers/Helmet Damage/Veteran.png",
      ],
      name: "Helmet Damage",
    },
    {
      id: 8,
      img: ["/images/layers/Helmet Extras/horns.png"],
      name: "Helmet Extras",
    },
    {
      id: 9,
      img: ["/images/layers/Soldier Type H/Heavy Trooper.png"],
      name: "Soldier Type H",
    },
    {
      id: 10,
      img: [
        "/images/layers/Weapon Left/Blue Staff.png",
        "/images/layers/Weapon Left/Blue Sword.png",
        "/images/layers/Weapon Left/Red Staff.png",
        "/images/layers/Weapon Left/Red Sword.png",
        "/images/layers/Weapon Left/Rifle.png",
      ],
      name: "Weapon Left",
    },
    {
      id: 11,
      img: [
        "/images/layers/Weapon Right/Blue Staff.png",
        "/images/layers/Weapon Right/Blue Sword.png",
        "/images/layers/Weapon Right/Red Staff.png",
        "/images/layers/Weapon Right/Red Sword.png",
        "/images/layers/Weapon Right/Rifle.png",
      ],
      name: "Weapon Right",
    },
    {
      id: 12,
      img: [
        "/images/layers/Heavy Armour Damage/Buffed Out.png",
        "/images/layers/Heavy Armour Damage/Experienced.png",
        "/images/layers/Heavy Armour Damage/Veteran.png",
      ],
      name: "Heavy Armour Damage",
    },
    {
      id: 13,
      img: [
        "/images/layers/Heavy Shoulder Damage Left/Buffed Out.png",
        "/images/layers/Heavy Shoulder Damage Left/Experienced.png",
        "/images/layers/Heavy Shoulder Damage Left/Veteran.png",
      ],
      name: "Heavy Shoulder Damage Left",
    },
    {
      id: 14,
      img: [
        "/images/layers/Heavy Shoulder Damage Right/Buffed Out.png",
        "/images/layers/Heavy Shoulder Damage Right/Experienced.png",
        "/images/layers/Heavy Shoulder Damage Right/Veteran.png",
      ],
      name: "Heavy Shoulder Damage Right",
    },
    {
      id: 15,
      img: [
        "/images/layers/Heavy Shoulder Left/Left Black.png",
        "/images/layers/Heavy Shoulder Left/Left Blue.png",
        "/images/layers/Heavy Shoulder Left/Left Cyan.png",
        "/images/layers/Heavy Shoulder Left/Left Green.png",
        "/images/layers/Heavy Shoulder Left/Left Pink.png",
        "/images/layers/Heavy Shoulder Left/Left Purple.png",
        "/images/layers/Heavy Shoulder Left/Left Red.png",
        "/images/layers/Heavy Shoulder Left/Left Scarlet.png",
        "/images/layers/Heavy Shoulder Left/Left Silver.png",
        "/images/layers/Heavy Shoulder Left/Left Tan.png",
        "/images/layers/Heavy Shoulder Left/Left White.png",
        "/images/layers/Heavy Shoulder Left/Left Yellow.png",
      ],
      name: "Heavy Shoulder Left",
    },
    {
      id: 16,
      img: [
        "/images/layers/Heavy Shoulder Right/Right Black.png",
        "/images/layers/Heavy Shoulder Right/Right Blue.png",
        "/images/layers/Heavy Shoulder Right/Right Cyan.png",
        "/images/layers/Heavy Shoulder Right/Right Green.png",
        "/images/layers/Heavy Shoulder Right/Right Pink.png",
        "/images/layers/Heavy Shoulder Right/Right Purple.png",
        "/images/layers/Heavy Shoulder Right/Right Red.png",
        "/images/layers/Heavy Shoulder Right/Right Scarlet.png",
        "/images/layers/Heavy Shoulder Right/Right Silver.png",
        "/images/layers/Heavy Shoulder Right/Right Tan.png",
        "/images/layers/Heavy Shoulder Right/Right White.png",
        "/images/layers/Heavy Shoulder Right/Right Yellow.png",
      ],
      name: "Heavy Shoulder Right",
    },
  ]

  // useEffect(() => {
  //   console.log("data", data)
  // }, [data])

  const handleSelect = ({ item, ind }: any) => {
    const exist =
      data.length > 0 && data?.find((child) => child?.img === item.img)

    if (exist) {
      const filtered =
        data.length > 0 ? data.filter((child) => child?.img != item.img) : []
      item.selected = false
      setData(filtered)
      setActive(999)
      setSelectedItems((selectedItems) =>
        selectedItems.filter((index) => index !== ind)
      )
    } else if (data.length <= 4) {
      item.selected = true
      setActive(ind)
      setData([...data, { img: item.img, name:item.name }])
      setSelectedItems([...selectedItems, ind])
    }
  }

  const getLayerTraitName = (imgPath: any) => {
    let words = imgPath.split("/")
    let layer = words[3]
    let trait = words[4].slice(0, -4)
    return { layer: layer, trait: trait }
  }

  const onMint = async () => {
    if (loading) {
      alert("loading...")
      return
    }
    if (!wallet.connected) {
      toast.error("No Wallet")
      return
    }
    if (data.length === 0) {
      toast.error("Please Select up to 5 traits")
      return
    }
    setLoading(true)

    let traitList: any = []
    for (let i = 0; i < data.length; i++) {
      let ltName = getLayerTraitName(data[i].img)
      traitList.push(ltName)
    }
    console.log("traitList", traitList)

    await mintTraits(wallet, connection, traitList)
    setLoading(false)
  }

  return (
    <div className=" w-full relative">
      <Sidebar />
      <Topbar />
      <div className="container">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className=" lg:col-span-2">
            <div className=" mt-5 max-h-[80vh] overflow-x-scroll cataCon  hidden w-full lg:grid grid-cols-1 lg:grid-cols-4 gap-5">
              {cardFakeData.map((item, ind) => (
                <CardItem
                  handleSelect={handleSelect}
                  item={item}
                  ind={ind}
                  active={active}
                  key={ind}
                  selectedItems={selectedItems}
                />
              ))}
            </div>
            <div className=" mt-5 block w-full lg:hidden ">
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                loop={true}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper mb-10 w-full flex items-center justify-center"
              >
                {" "}
                {cardFakeData.map((item, ind) => (
                  <SwiperSlide style={{ width: "100%" }} className=" relative ">
                    <CardItem
                      handleSelect={handleSelect}
                      item={item}
                      ind={ind}
                      active={active}
                      key={ind}
                      selectedItems={selectedItems}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div>
            <div className=" flex items-center justify-between">
              <p className=" text-xl text-white ">Selected Traits</p>
              <p className="  text-white ">
                Traits : <span className=" text-ac"> {data.length}/5</span>
              </p>
            </div>
            <div
              className=" mt-5 w-full hidden lg:block "
              style={{
                background:
                  "linear-gradient(266.4deg, rgba(36, 0, 251, 0.1) -40.83%, rgba(214, 36, 223, 0.1) 153.78%)",
                height: "700px",
              }}
            >
              <div
                style={{ height: "550px" }}
                className=" w-full hidden lg:block cataCon"
              >
                <div className=" w-full  grid grid-cols-3 gap-5 p-5">
                  {data.map((item, ind) => (
                    <div key={ind} className=" relative w-full">
                      <img src="/images/mini.png" alt="" />
                      <div className=" w-full -mt-1 flex items-center justify-center absolute top-0 left-0">
                        <img
                          src="/images/traits.gif"
                          alt={item.name}
                          className="w-20 h-25 "
                        />

                        {/* <img src={item.img} alt={item.name} /> */}
                      </div>
                      <p className="pt-1 text-sm active_card_text uppercase mx-auto text-center font-semibold">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{ height: "150px" }}
                className=" w-full flex items-center justify-center"
              >
                <div className=" relative cursor-pointer" onClick={onMint}>
                  <img src="/images/mnt.png" alt="" />
                  <div className=" absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
                    <p className=" text-white text-xl uppercase">
                      {loading ? "Minting..." : "Mint"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className=" mt-5 w-full blcok lg:hidden"
              style={{
                background:
                  "linear-gradient(266.4deg, rgba(36, 0, 251, 0.1) -40.83%, rgba(214, 36, 223, 0.1) 153.78%)",
                height: "500px",
              }}
            >
              <div
                style={{ height: "350px" }}
                className=" w-full block lg:hidden cataCon"
              >
                <div className=" w-full  grid grid-cols-3 gap-5 p-5">
                  {data.map((item, ind) => (
                    <div key={ind} className=" relative w-full">
                      <img src="/images/mini.png" alt="" />
                      <div className=" w-full mt-3 flex items-center justify-center absolute top-0 left-0">
                        <>
                          {/* {console.log("JimpImage(item?.img)", item?.img)} */}
                          {/* {item.img ? (
                            JimpImage(item?.img)
                            <img src={item?.img || "/"} alt="" />
                          ) : (
                            <img src={item?.img || "/"} alt="" />
                          )} */}
                          {/* {JimpImage(item?.img)} */}
                          <img src={item?.img || "/"} alt="" />
                        </>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{ height: "150px" }}
                className=" w-full flex items-center justify-center"
              >
                <div className=" relative cursor-pointer" onClick={onMint}>
                  <img src="/images/mnt.png" alt="" />
                  <div className=" absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
                    <p className=" text-white text-xl uppercase">
                      {loading ? "Minting..." : "Mint"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CardItem = ({ handleSelect, item, ind, active, selectedItems }: any) => {
  const [imageUrl, setImageUrl] = useState("/")

  useEffect(() => {
    const random = Math.floor(Math.random() * item.img.length)
    setImageUrl(item.img[random] ? item.img[random] : item.img[0])
  }, [])
  const data = { img: imageUrl, name: item.name }

  const getSelected = (ind: any) => selectedItems.includes(ind)

  return (
    <div
      onClick={() => handleSelect({ item: data, ind, active })}
      className=" relative w-full cursor-pointer"
    >
      {getSelected(ind) ? (
        <img src="/images/sm_card.png" alt="" />
      ) : (
        <img src="/images/incative_sm.png" alt="" />
      )}
      {/* {active === ind ? (
          <img src="/images/sm_card.png" alt="" />
        ) : (
          <img src="/images/incative_sm.png" alt="" />
        )} */}
      <div className=" absolute top-0 left-0 w-full h-full z-10 p-2">
        <img src="/images/sm_bg.png" alt="" />
      </div>
      <div className="absolute inset-0 w-40 h-40 z-20 flex items-center justify-center">
        <img
          src="/images/traits.gif"
          alt="img"
          className="w-40 h-40 aspect-square !m-auto"
        />
      </div>
      <p className=" pt-1 text-xl text-white uppercase mx-auto text-center font-semibold">
        {item.name}
      </p>
    </div>
  )
}

export default TraitsMint
