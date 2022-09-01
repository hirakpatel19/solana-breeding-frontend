import React, { useEffect, useState } from "react"
import Card from "../components/Card"
import CardForBreed from "../components/CardForBreed"
import Sidebar from "../layout/Sidebar"
import Topbar from "../layout/Topbar"
import { Swiper, SwiperSlide } from "swiper/react"
// import required modules
import { Pagination, Navigation } from "swiper"

import axios from "axios"
import { toast } from "react-toastify"

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

import { getAllNftData, getNftMetadataURI } from "../contract/utils"
import { getNftCreatorKey } from "contract/keys"
import { mintMainNft } from "contract/helper"

const Home = () => {
  const wallet = useWallet()
  const { connection } = useConnection()

  const [nftCount, setNftCount] = useState(0)
  const [selectedCount, setSelectedCount] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardData, setCardData] = useState<any>([])
  const [mainNftData, setMainNFTData] = useState<any>([])

  let cardFakeData = [
    {
      id: 1,
      img: [
        {
          img: "/images/img1.png",
          name: "",
          trait: "",
          selected: false,
          activeIndex: 0,
          nftData: null,
        },
      ],
      name: "helmet",
      trait: "",
      selected: false,
      activeIndex: 0,
      nftData: null,
    },
  ]
  let mainNftFakeData = [
    {
      id: 1,
      img: ["/images/img1.png"],
      name: "Breed Nft",
      trait: "",
      selected: false,
      activeIndex: 0,
      nftData: null,
    },
  ]
  const [active, setActive] = useState({
    id: 1,
    img: "/images/img1.png",
    title: "helmet",
  })


  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUserNfts()
  }, [wallet.publicKey])

  const fetchUserNfts = async () => {
    if (!wallet.publicKey) {
      return
    }

    let data: any = await getAllNftData(wallet, connection)
    let a = 0
    if (data) {
      let creatorKey: any = await getNftCreatorKey()
      cardFakeData = []
      mainNftFakeData = []
      for (let i = 0; i < data.length; i++) {
        let item = data[i]

        if (item.data.creators) {
          let verifiedCreators = item.data.creators.filter(
            (creator: any) => creator.verified == 1
          )
          if (verifiedCreators && verifiedCreators.length > 0) {
            if (creatorKey.equals(new PublicKey(verifiedCreators[0].address))) {
              // get uri
              try {
                let uri = await axios.get(item.data.uri)
                let foundEle = mainNftFakeData.find(
                  (ele) => ele.name == uri.data.name
                )
                if (uri.data.attributes.length > 10 && foundEle) {
                  // main nft
                  // console.log("hi")
                  // foundEle.img.push(uri.data.image)
                  continue
                } else if (uri.data.attributes.length > 10) {
                  // console.log("data", data)
                  // console.log("uri", uri.data)
                  mainNftFakeData.push({
                    id: mainNftFakeData.length + 1,
                    img: [uri.data.image],
                    name: uri.data.name,
                    trait: uri.data.attributes[0].value,
                    selected: false,
                    activeIndex: 0,
                    nftData: item,
                  })
                  continue
                }

                // console.log("trait path", uri.data.image)

                let foundEle2 = cardFakeData.find(
                  (ele) => ele.name == uri.data.attributes[0].trait_type
                )

                // console.log("foundEle2", foundEle2)
                if (foundEle2) {
                  a++
                  // console.log("foundEle2", cardFakeData)
                  // console.log("cardFakeData.length", foundEle2.childs.length)
                  foundEle2.img.push({
                    img: uri.data.image,
                    name: uri.data.attributes[0].trait_type,
                    trait: uri.data.attributes[0].value,
                    selected: false,
                    activeIndex: 0,
                    nftData: item,
                  })
                } else {
                  a++
                  // console.log("cardFakeData", cardFakeData)
                  // console.log("cardFakeData.length", cardFakeData.length)
                  cardFakeData.push({
                    id: cardFakeData.length + 1,
                    img: [
                      {
                        img: uri.data.image,
                        name: uri.data.attributes[0].trait_type,
                        trait: uri.data.attributes[0].value,
                        selected: false,
                        activeIndex: 0,
                        nftData: item,
                      },
                    ],
                    name: uri.data.attributes[0].trait_type,
                    trait: uri.data.attributes[0].value,
                    selected: false,
                    activeIndex: 0,
                    nftData: item,
                  })
                }

                // collection.push({ mint: item.mint, id: collection.length.toString(), name: item.data.name, image: uri.data.image, rarity: rarity });
              } catch (error) {
                console.log("axios error : ", item)
              }
            }
          }
        }
      }

      setNftCount(a)
      setCardData(cardFakeData)
      setMainNFTData(mainNftFakeData)
    }
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

    let selectedTraits2:any = []

    let selectedTraits = cardData.map((item:any, ele: any) => {
      item?.img.map((item2:any, ele2:any) =>{
        if(item2.selected){
          const name = item2.name
          const trait = item2.trait
          const nftData = item2.nftData
          selectedTraits2.push({ name, trait, nftData })
        }
      })
    })
    if (selectedTraits2.length > 5) {
      selectedTraits = selectedTraits.slice(0, 5)
    }
    if (selectedTraits2.length === 0) {
      toast.error("Please Select up to 5 traits")
      return
    }

    setLoading(true)

    console.log("selectedTraits2", selectedTraits2)

    const tx = await mintMainNft(wallet, connection, selectedTraits2)
    // console.log("tx",tx)
    fetchUserNfts()

    setLoading(false)
  }

  console.log("mainNftData", mainNftData)

  return (
    <div className="  w-full relative">
      <Sidebar />
      <Topbar />
      <div className="container">
        <div className=" flex items-center gap-0 lg:gap-20 xl:gap-0  ">
          <div className="relative ">
            <img src="/images/btn1.png" alt="" />
            <div className=" absolute top-0 left-0 h-full flex  items-center justify-between gap-10">
              <p className=" text-2xl text-white pl-8 font-medium">
                NFTs Owned
              </p>
              <div className="relative">
                <img src="/images/btn1_in.png" alt="" />
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                  <p className="text-white text-xl">{nftCount}</p>
                </div>
              </div>
            </div>
          </div>
          <div className=" hidden lg:flex xl:hidden items-center justify-center gap-5 ">
            <a target="__blank" href="">
              <img src="/images/facebook.png" alt="" />
            </a>
            <a target="__blank" href="">
              <img src="/images/youtube.png" alt="" />
            </a>
            <a target="__blank" href="">
              <img src="/images/twitter.png" alt="" />
            </a>
            <a target="__blank" href="">
              <img src="/images/linkedin.png" alt="" />
            </a>
          </div>
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-10 gap-5 mt-2">
          <div className=" col-span-7 flex items-center justify-end text-white text-2xl">
            max : {selectedCount.length}/5
          </div>
          <div></div>
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-10 lg:gap-8 mt-2">
          <div className=" flex items-center justify-center lg:hidden lg:col-span-3">
            <div className=" w-full md:w-96 h-96 lg:h-full relative col-span-3 block lg:hidden  px-3 py-10 lg:pt-5">
              <div className=" w-full h-full absolute top-0 left-0 ">
                <img
                  src="/images/preview.png"
                  className=" w-full h-full lg:object-contain"
                  alt=""
                />
              </div>
              <div className=" w-full  flex items-center relative h-4/5 flex-col justify-center">
                <img src={active?.img} className="relative  z-10" alt="" />
                <div className=" w-full h-full absolute top-0 left-0 ">
                  <img
                    src="/images/preview_bg.png"
                    className=" w-full h-full  lg:object-contain"
                    alt=""
                  />
                </div>
              </div>
              <div className=" flex items-center justify-center mt-5 text-xl  pilot w-full text-white">
                {active?.title}
              </div>
            </div>
          </div>
          <div className=" lg:col-span-7 hidden lg:grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cardData.map((item: any, ind: any) => (
              <Card
                active={active}
                setActive={setActive}
                item={item}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                ind={ind}
                setSelectedCount={setSelectedCount}
                selectedCount={selectedCount}
              />
            ))}
          </div>
          <div className=" w-full lg:col-span-7 hidden md:block lg:hidden ">
            <Swiper
              slidesPerView={2}
              spaceBetween={10}
              loop={true}
              navigation={true}
              modules={[Navigation]}
              className="mySwiper mb-10"
            >
              {" "}
              {cardFakeData.map((item, ind) => (
                <SwiperSlide style={{ width: "100%" }} className=" relative ">
                  <Card
                    active={active}
                    setActive={setActive}
                    item={item}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    ind={ind}
                    setSelectedCount={setSelectedCount}
                    selectedCount={selectedCount}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className=" w-full lg:col-span-7 block md:hidden lg:hidden ">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              loop={true}
              navigation={true}
              modules={[Navigation]}
              className="mySwiper mb-10"
            >
              {" "}
              {cardFakeData.map((item, ind) => (
                <SwiperSlide style={{ width: "100%" }} className=" relative ">
                  <Card
                    active={active}
                    setActive={setActive}
                    item={item}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    ind={ind}
                    setSelectedCount={setSelectedCount}
                    selectedCount={selectedCount}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className=" w-full relative col-span-3 hidden lg:block  px-3 py-10 lg:pt-5">
            <div className=" w-full absolute top-0 left-0 ">
              <img
                src="/images/preview.png"
                className=" w-full  lg:object-contain"
                alt=""
              />
            </div>
            <div className=" w-full  flex items-center relative h-96 xl:h-full  flex-col justify-center">
              {/* {mainNftData.map((item: any, ind: any) => ( */}
                <CardForBreed
                  active={active}
                  setActive={setActive}
                  item={mainNftData}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              {/* ))} */}
            </div>
            <div className="col-span-3 flex items-center justify-end ">
              <div
                className=" relative cursor-pointer lg:mt-20 xl:mt-20"
                onClick={onMint}
              >
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
  )
}

export default Home
