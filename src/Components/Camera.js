import React, { useState } from 'react'
import { useEffect,useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam'


const videoConstrains = {
    width :540,
    facingMode : 'environment'
}
const Camera = (props) => {
    const navigate = useNavigate();
    const webcamRef = useRef(null)
    const [url,setUrl] = useState(null);

    const capturePhoto = React.useCallback(async() =>{
        const imageSrc = webcamRef.current.getScreenshot()
        setUrl(imageSrc)
        props.setcmaUrl((current) => [...current,{file: imageSrc , type: 'base64'}])
        props.setadd((current) => [...current,{file: imageSrc , type: 'base64'}])
        
    },[webcamRef])

    const onUserMedia = (e) =>{
        console.log(e)
    }
    const Refresh = () =>{
        setUrl(null);
        props.setcmaUrl(null)
    }
    const nav = () =>{
        
        props.setcmp(true)
        // navigate('/AddPost')
    }
  return (
    <div>
        <Webcam 
            ref={webcamRef}
            audio={true}
            screenshotFormat='image/png'
            videoConstraints={videoConstrains}
            onUserMedia={onUserMedia}
            mirrored={true}
        />
        <button onClick={capturePhoto}>Capture Photo</button>
        <button onClick={Refresh}>Refresh</button>
        <button onClick={nav}>Add To Post</button>
        {
            url && (
                <div>
                    <img src={url} alt='ScreenShot'/>
                </div>

            )
        }
    </div>
  )
}

export default Camera