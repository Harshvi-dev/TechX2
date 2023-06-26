import React, { useCallback, useEffect, useRef, useState  } from 'react'
import './Media.css'
import Slider from "react-slick";

const Media = ({img}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
 console.log("img:",img)
   return(
    // <div>
    // { 
    //   singleImage.type == 'image/png'? <img src={singleImage.file} alt="Post Image" className="img" />:
    //   <video className='img'>
    //     <source src={singleImage.file}></source>
    //   </video> 
    // }
    // </div>
    <Slider {...settings}>
      <div>
        {
          img.map((singleImage) => {
            singleImage.type == 'image/png'? <img src={singleImage.file} alt="Post Image" className="img" />:
            <video className='img'>
                <source src={singleImage.file}></source>
            </video>
          })
        }
      </div>
    </Slider>
   )
}

export default Media