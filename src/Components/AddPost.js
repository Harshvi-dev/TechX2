import React, { useEffect, useState } from "react";
import "./AddPost.css";
import { json, useNavigate } from "react-router-dom";
import Camera from "./Camera";
import { storage } from "../Config";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  listAll,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { database, messaging } from "../Config";
import { onMessageListener } from "../Config";
import {
  set,
  ref as databaseRef,
  push,
  onValue,
  update,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPost = () => {
  const navigate = useNavigate();
  const [text, setText] = useState();
  const [url, addSetUrl] = useState([]);
  const [cmp, setcmp] = useState(true);
  const [uploadImg, setUploadImg] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [disable, setDisable] = useState(true);
  const [likePost, setLikePost] = useState([]);
  const [favPost, setFavPost] = useState([]);
  const [commentPost, setCommentPost] = useState([]);
  const [userData, setUserData] = useState([]);

  let regResult;
  let dec;

  const auth = getAuth();
  const user = auth.currentUser;

  const getUserData = async () => {
    const Ref = databaseRef(database, "user/");
    await onValue(Ref, (snapshot) => {
      const data = snapshot.val();
      console.log("DATA", data);
      if (data) {
        const newUser = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // setUserData(newUser)
        console.log("POST DATA", newUser);
        notify(newUser);
      }
      // sendNotificationToUser()
    });
  };
  var current = new Date();

  const notify = (users) => {
    console.log("users :", users);
    for (let i = 0; i < users.length; i++) {
      console.log("i:", users[i]);
      if (users[i].user_id === user.email) {
        continue;
      } else {
        sendMessage(users[i].token);
      }
    }
  };

  const sendMessage = async (token) => {
    const accessToken = token;

    // NEW IMPLEMENT

    const FIREBASE_API_KEY =
      "AAAAmkVJRBg:APA91bHCkkQg-omxDIDJ9MoEBsqgJ2x66BuyPBakh9VSOaS027TNdvhtxecABB__JfuAG2LqMzK-J0GKoAoZIU46hGlR18mkQq6gc0QylhyX0DZrMjVWB1JouHVzE4oAe607K-0hVtsA";

    const message = {
      registration_ids: [accessToken],
      notification: {
        title: `${user.displayName}`,
        body: "New Post Added",
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: "high",
        content_available: true,
      },
    };

    let headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "key=" + FIREBASE_API_KEY,
    });

    try {
      let response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers,
        body: JSON.stringify(message),
      });
      console.log("=><*", response);
      response = await response.json();
      console.log("=><*", response);
    } catch (error) {
      console.log("ERROR WHILE SEND PUSH NOTIFICATION", error);
    }
  };

  useEffect(() => {
    console.log("url :", url);
    // console.log("type useEffect :", type);
    console.log("uploaded img UseEffect:", uploadImg);
    console.log("text :", text);
    console.log("disabled:", disable);
    if (imageUrls.length > 0) {
      addSetUrl(imageUrls);
    }
    // console.log("edit like :", likePost);
    // console.log("edit fav :", favPost);
    // console.log("edit comment :", commentPost);

    // console.log("POST DATA", userdata);
    // getUserData()
  }, [url, imageUrls]);

  // onMessageListener().then((payload) => {
  //   setNotification({title: payload.notification.title, body: payload.notification.body})
  //   console.log("payload",payload);
  // }).catch(err => console.log('failed: ', err));
  const back = () => {
    navigate("/home");
  };

  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  const getVal = (e) => {
    const temp_text = e.target.value;
    setText(temp_text);
  };
  const srcImg = (e) => {
    console.log("WHEN FILE SELECTED", e.target.files);
    addSetUrl((current) => {
      if (current === undefined) {
        return [{ file: URL.createObjectURL(e.target.files[0]), type: "blob" }];
      } else {
        return [
          ...current,
          { file: URL.createObjectURL(e.target.files[0]), type: "blob" },
        ];
      }
    });

    setUploadImg((current) => {
      if (current === undefined) {
        return [{ file: e.target.files[0], type: "blob" }];
      } else {
        return [...current, { file: e.target.files[0], type: "blob" }];
      }
    });
    if (uploadImg == null) {
      return;
    }
  };
  const handelCam = () => {
    setcmp(!cmp);
    console.log("cmp :", cmp);
  };

  // new Promise((resolve, reject) => {
  const addPost = async (e) => {
    const reg = /(?:\s|^)?#[A-Za-z0-9\-\.\_]+(?:\s|$)/g;
    regResult = text.match(reg);
    console.log("reg :", regResult);

    let hasIndex;
    hasIndex = text.indexOf("#");
    console.log(hasIndex);
    if (hasIndex !== -1) {
      console.log(text.substring(0, hasIndex));
      dec = text.substring(0, hasIndex);
      console.log("sub string:", dec);
    } else {
      dec = text;
    }
    // setText(dec)
    // console.log("desciption after removing #:", text);

    getUserData();
    // alert("hello")

    // let arr = [];

    const imgUploading = await uploadImagesinStorage();

    console.log("AFTER UPLOAD IMAGE", imgUploading);
    console.log("t :", imgUploading.type);
    if (id == null) {
      await storeInDatabase(imgUploading, regResult);
    } else {
      await editPost(imgUploading, regResult);
    }
  };
  // });

  async function uploadImagesinStorage() {
    let postList = [];
    let i;
    console.log("upload:", uploadImg);
    const imageLength = uploadImg.length || [];
    for (i = 0; i < imageLength; i++)
      if (uploadImg[i].type.includes("image") == true) {
        postList.push(await uploadImg[i]);
        // continue;
      } else {
        postList.push(await singleImageUpload(uploadImg[i]));
      }

    console.log("postList :", postList);
    return postList;
  }

  async function singleImageUpload(singleImg) {
    // let postListObj =[];
    if (singleImg.type == "blob") {
      const Blobf = singleImg.file;
      console.log("file :", Blobf);
      console.log("file type :", Blobf.type);
      var type = Blobf.type;
      const imageRef = ref(storage, `images/${Blobf.name}`);
      const snapshot = await uploadBytesResumable(imageRef, Blobf);
      const urls = await getDownloadURL(snapshot.ref);
      console.log(" img array :", urls);
      console.log("type:", type);
      // postListObj.push({file : urls,type:type})
      return {
        file: urls,
        type: type,
      };
    } else {
      const Basef = singleImg.file;
      const name = makeid(5);
      const imgref = ref(storage, `images/${name}`);
      const snapshot = await uploadString(imgref, Basef, "data_url");
      const urls = await getDownloadURL(snapshot.ref);
      console.log(" img array :", urls);
      return {
        file: urls,
        type: "image/base64",
      };
    }
  }

  const storeInDatabase = async (arr, regResult) => {
    console.log("arr ===", arr);
    console.log("regResult : ", regResult);

    const postListRef = databaseRef(database, "/post");
    const newPostRef = push(postListRef);
    set(newPostRef, {
      description: dec,
      hash: regResult || [],
      imageURL: arr,
      user_id: user.email,
      date: JSON.stringify(current),
      like: [],
      fav: [],
      Comment: [],
      photo_url: user.photoURL,
      user_name: user.displayName,
    });
    toast("Post added!");
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  };

  const del = (e) => {
    var id = e.currentTarget.id;
    console.log("id:", id);
    let oldUrl = [...url];
    let oldUploadImg = [...uploadImg];
    oldUploadImg.splice(id, 1);
    oldUrl.splice(id, 1);
    addSetUrl(oldUrl);
    setUploadImg(oldUploadImg);

    console.log("del url", url);
  };
  function checkFileType(type) {
    if (
      type.includes("image") ||
      type.includes("blob") ||
      type.includes("base64")
    )
      return true;
    else return false;
  }
  const printImg = (iteam, index) => {
    console.log("item:", iteam);
    return (
      <>
        <div className="imgPrint">
          {checkFileType(iteam.type) ? (
            <img src={iteam.file} id="img"></img>
          ) : (
            <video id="vid">
              {" "}
              <source src={iteam.file} />
            </video>
          )}
          <button className="imgDel" onClick={del} id={index}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </>
    );
  };

  // EDIT

  const { id } = useParams();
  console.log("your id is :", id);
  console.log("show text", text);
  useEffect(() => {
    if (id != null) {
      getSinglePostData(id);
    }
    async function getSinglePostData(id) {
      let data;
      const Ref = databaseRef(database, `post/${id}`);

      await new Promise((resolve) => {
        onValue(Ref, (snapshot) => {
          data = snapshot.val();
          console.log("data:", data);
          resolve();
        });
      });
      fillData(data);
    }
  }, []);
  const fillData = (data) => {
    console.log("data:", data);
    var dataDec = data.description + data.hash;
    console.log("dataDec", dataDec.includes("undefined"));
    if (dataDec.includes("undefined")) {
      dec = data.description;
      setText(dec);
    } else {
      dec = dataDec;
      setText(dec);
    }
    addSetUrl(data.imageURL);
    setLikePost(data.like || []);
    setFavPost(data.fav || []);
    setCommentPost(data.comment || []);
    setUploadImg(data.imageURL || []);
  };

  const editPost = async (arr, regResult) => {
    console.log("dec :", dec);
    console.log("has :", regResult);
    update(databaseRef(database, `post/${id}`), {
      description: dec,
      hash: regResult || [],
      imageURL: arr,
      user_id: localStorage.getItem("email"),
      date: JSON.stringify(current),
      like: likePost,
      fav: favPost,
      comment: commentPost,
      user_name: user.displayName,
    });
    // alert("done edited");
    toast("Post edit!");
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  };

  // return (
  //   <>
  //     <div className="HomeDiv">
  //       <div className="justify">
  //         {id === undefined ? (
  //           <h2 className="title">Create Post</h2>
  //         ) : (
  //           <h2 className="title">Edit Post</h2>
  //         )}
  //         <button className="icon" onClick={back}>
  //           <i className="fa-solid fa-xmark"></i>
  //         </button>
  //       </div>
  //       <hr />

  //       {!!cmp ? (
  //         <>
  //           <div>
  //             <textarea
  //               className="tArea"
  //               rows="30"
  //               cols="500"
  //               value={text}
  //               onChange={getVal}
  //             />
  //           </div>
  //           <div className="showImg">
  //             {url &&
  //               url.length > 0 &&
  //               url.map((iteam, index) => printImg(iteam, index))}
  //           </div>
  //           <div className="photo">
  //             <label htmlFor="file-input">
  //               <i className="fa-sharp fa-solid fa-image" id="photoIcon"></i>
  //             </label>
  //             <p>Photo/Video</p>
  //             <input
  //               type="file"
  //               id="file-input"
  //               accept="image/png , image/jpeg,video/mp4,video/x-m4v"
  //               onChange={srcImg}
  //             />
  //           </div>
  //           <div className="Cam" onClick={handelCam}>
  //             <i className="fa-solid fa-camera" id="photoIcon"></i>
  //             <p>Camera</p>
  //           </div>
  //         </>
  //       ) : (
  //         <div>
  //           <Camera
  //             setcmaUrl={setUploadImg}
  //             setadd={addSetUrl}
  //             setcmp={setcmp}
  //           />
  //         </div>
  //       )}
  //       {id === undefined ? (
  //         <div>
  //           {console.log(
  //             "text:",
  //             text,
  //             "url:",
  //             url.length,
  //             "image:",
  //             imageUrls.length
  //           )}
  //           <button
  //             className="Post"
  //             disabled={url.length == 0 && text == ""}
  //             onClick={addPost}
  //           >
  //             <b>Post</b>
  //           </button>
  //         </div>
  //       ) : (
  //         <div>
  //           <button
  //             className="Post"
  //             disabled={url && url.length == 0 && text == ""}
  //             onClick={addPost}
  //           >
  //             <b>Edit</b>
  //           </button>
  //         </div>
  //       )}

  //       <ToastContainer
  //         position="bottom-center"
  //         autoClose={5000}
  //         hideProgressBar={false}
  //         newestOnTop={false}
  //         closeOnClick
  //         rtl={false}
  //         pauseOnFocusLoss
  //         draggable
  //         pauseOnHover
  //         theme="dark"
  //       />
  //     </div>
  //   </>
  // );
  return (
    <>
      <div className="row justify-content-center ">
        <div className="col-5" style={{ textAlign: "center" }}>
          {id === undefined ? (
            <h2 className="title">Create Post</h2>
          ) : (
            <h2 className="title">Edit Post</h2>
          )}
        </div>
        <div className="col-3" style={{ textAlign: "center" }}>
          <button className="icon" onClick={back}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div className="row justify-content-center ">
        <div className="col-12">
          <hr />
        </div>
      </div>
      <div className="row justify-content-center ">
        <div className="col-lg-auto col-sm-auto ">
          {!!cmp ? (
            <>
              <div>
                {" "}
                <textarea
                  className="tArea"
                  rows="15"
                  cols="100"
                  value={text}
                  onChange={getVal}
                  placeholder="make a post!"
                />
              </div>
              <div className="row justify-content-center">
                <div className="col-12"style={{border:"solid red"}}>
                <div className="showImg">
                  {url &&
                    url.length > 0 &&
                    url.map((iteam, index) => printImg(iteam, index))}
                </div>
              </div>
              </div>
              <div className="row">
                <div className="col-5 col-sm-5" style={{ textAlign: "center" }}>
                  <div className="photo">
                    <label htmlFor="file-input">
                      <i
                        className="fa-sharp fa-solid fa-image"
                        id="photoIcon"
                      ></i>
                    </label>
                    <p>Photo/Video</p>
                    <input
                      type="file"
                      id="file-input"
                      accept="image/png , image/jpeg,video/mp4,video/x-m4v"
                      onChange={srcImg}
                    />
                  </div>
                </div>
                <div className="col-2"></div>
                <div className="col-5" style={{ textAlign: "center" }}>
                  <div className="Cam" onClick={handelCam}>
                    <i className="fa-solid fa-camera" id="photoIcon"></i>
                    <p>Camera</p>
                  </div>
                </div>
              </div>
              <div className="row">
                {id === undefined ? (
                  <div className="col-12" style={{ textAlign:"center"}}>
                    {console.log(
                      "text:",
                      text,
                      "url:",
                      url.length,
                      "image:",
                      imageUrls.length
                    )}
                    <button
                      className="Post"
                      disabled={url.length == 0 && text == ""}
                      onClick={addPost}
                    >
                      <b>Post</b>
                    </button>
                  </div>
                ) : (
                  <div >
                    <button
                      className="Post"
                      disabled={url && url.length == 0 && text == ""}
                      onClick={addPost}
                    >
                      <b>Edit</b>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <Camera
                setcmaUrl={setUploadImg}
                setadd={addSetUrl}
                setcmp={setcmp}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddPost;
