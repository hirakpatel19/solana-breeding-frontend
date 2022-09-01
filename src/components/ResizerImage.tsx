import React, { useState, useRef, useEffect } from "react"
import Resizer from "react-image-file-resizer"


type CropImageProps = {
  imageIn: any
  imageOut: any
}

const ResizerImage: React.FC<CropImageProps> = ({ imageOut, imageIn }) => {
  const inputImage = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<any>()

  useEffect(() => {
    typeof imageIn === "string" &&
      setImage(`http://localhost:3000/images${imageIn}`)
    !imageIn && setImage(null)

    const loadImage = (imageIn: any) => {
      resizeFile(imageIn).then((res: any) => {
        const resizedImage = URL.createObjectURL(res)
        setImage(resizedImage.toString())
        imageOut(res)
      })
    }
  }, [imageIn, ])

  const resizeFile = (file: any) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file.target.files[0],
        200,
        200,
        "png",
        60,
        0,
        (uri) => {
          resolve(uri)
        },
        "file"
      )
    })
  

  return (
    <div>
      {imageOut ? (
        <img src={image} alt="Preview" />
      ) : (
        <>
          <span className="material-icons">image</span>
        </>
      )}
    </div>
  )
}

export default ResizerImage
