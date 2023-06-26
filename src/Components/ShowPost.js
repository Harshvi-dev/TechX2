import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
// import Media from "./Media";
import Slider from "react-slick";
import "./Media.css";
import { useNavigate } from "react-router-dom";
import { database } from "../Config";
import {
  ref,
  update,
  remove,
  onValue,
  set,
  onChildAdded,
} from "firebase/database";
import ReactTimeAgo from "react-time-ago";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowPost = ({ post }) => {
  const [showTextBox, setShowTextBox] = useState(null);

  const [favCss, setFavCss] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const Ref = ref(database, "post/");
    onChildAdded(Ref, (snap) => {
      console.log("snap:", snap.val());
    });
  });
  console.log("POST TO BE DISPLAY", post);
  // post.reverse();
  const currentDate = new Date().toISOString();
  console.log("currentDate", currentDate);
  console.log("POST TO BE DISPLAY", post);
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const auth = getAuth();
  const user = auth.currentUser;
  let d = new Date();

  // Redirect to edit post page
  const edit = (id) => {
    console.log("id :", id);
    navigate(`/edit/${id}`);
  };
  const del = (id) => {
    console.log("id:", id);
    console.log(ref(database, `post/${id}`));
    console.log(remove);
    const Ref = ref(database, `post/${id}`);
    remove(Ref).then(() => {
      // alert("data deleted");
      toast("Post deleted ", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      
    });
  };

  const likeUpdate = (iteam, id) => {
    console.log("iteam:", iteam, "id:", id);
    set(ref(database, `post/${id}/like/`), iteam);
  };

  const favUpdate = (iteam, id) => {
    console.log("iteam:", iteam, "id:", id);
    set(ref(database, `post/${id}/fav/`), iteam);
  };
  const likePost = (id, iteam) => {
    var tempIteam = iteam;
    console.log("id:", id, "iteam", iteam);
    if (iteam === undefined) {
      let tempIteam = [];
      tempIteam.push({
        date: JSON.stringify(currentDate),
        user_id: user.email,
      });
      likeUpdate(tempIteam, id);
    } else {
      var i = iteam.findIndex((p) => p.user_id == user.email);
      console.log("i:", i);
      if (i === -1) {
        iteam.push({
          date: currentDate,
          user_id: user.email,
        });
        likeUpdate(iteam, id);
        console.log("item", iteam);
      } else {
        iteam.splice(i, 1);
        likeUpdate(iteam, id);
        console.log("DISLIKE", iteam);
      }
    }
  };
  const favPost = (id, iteam) => {
    console.log("id:", id, "iteam:", iteam);
    if (iteam === undefined) {
      let tempIteam = [];
      tempIteam.push({
        date: JSON.stringify(currentDate),
        user_id: user.email,
      });
      favUpdate(tempIteam, id);
      console.log("tempIteam :", tempIteam);
    } else {
      var i = iteam.findIndex((p) => p.user_id == user.email);
      console.log("i:", i);
      if (i === -1) {
        iteam.push({
          date: currentDate,
          user_id: user.email,
        });
        favUpdate(iteam, id);
        console.log("item:", iteam);
      } else {
        iteam.splice(i, 1);
        favUpdate(iteam, id);
        console.log("DISLIKE", iteam);
      }
    }
  };
  const commentText = (e) => {
    var temp_text = e.target.value;
    console.log("text:", temp_text);
    setText(temp_text);
  };
  const commentPost = (id, iteam, index) => {
    console.log("id:", id, "iteam:", iteam, "index: ", index);
    if (showTextBox === null) {
      setShowTextBox(index);
    } else {
      if (index === showTextBox) {
        setShowTextBox(null);
      } else {
        setShowTextBox(index);
      }
    }

    console.log("showTextBox:", showTextBox);
    setFavCss(!favCss);
    // setShowTextBox(!showTextBox)
  };
  const updateComment = (id, iteam) => {
    console.log("iteam:", iteam, "id:", id);
    set(ref(database, `post/${id}/comment/`), iteam);
  };
  const commentSubmit = (id, iteam) => {
    console.log("id:", id, "iteam:", iteam);
    console.log("TEXT:", text);
    if (iteam === undefined) {
      const tempIteam = [];
      tempIteam.push({
        text: text,
        date: JSON.stringify(new Date()),
        user_name: user.displayName,
        user_id: user.email,
      });
      updateComment(id, tempIteam);
      setText("");
      // setShowTextBox(!showTextBox)
      // setFavCss(!favCss)
      console.log("commnts array:", tempIteam);
      alert("comment added", "done");
    } else {
      iteam.push({
        text: text,
        date: JSON.stringify(new Date()),
        user_name: user.displayName,
        user_id: user.email,
      });
      updateComment(id, iteam);
      setText("");
      // setShowTextBox(!showTextBox)
      // setFavCss(!favCss)
      console.log("commnts array:", iteam);
      alert("comment added");
    }
  };
  const setColorOfHeart = (fav) => {
    console.log("fav:", fav);
    if (fav === undefined) {
      return "gry";
    } else {
      var colDemo = fav.findIndex((d) => d.user_id === user.email);
      console.log("colDemo:", colDemo);
      if (colDemo === -1) {
        return "gry";
      }
    }
  };
  const setColor = (u_id) => {
    console.log("likeArr:", u_id);
    if (u_id === undefined) {
      return "gry";
    } else {
      var colDemo = u_id.findIndex((d) => d.user_id == user.email);
      console.log("colDemo", colDemo);
      if (colDemo === -1) {
        // alert("hey")
        return "gry";
      }
    }
  };
  return (
    <>
    <div className="container">
      <div className="row"></div>
      {post.map((item, index) => {
        console.log(
          "inside main return functioin value of showTextBox :",
          item
        );
        return (
          <div className="container" key={item.id}>
            <div className="card mt-5">
              <div className="card-body">
                <div className="media">
                  <img
                    src={item.photo_url}
                    className="mr-3 rounded-circle"
                    alt="Profile Picture"
                    style={{ width: 60 }}
                  />
                  {user.email == item.user_id ? (
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa-solid fa-ellipsis"></i>
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <a
                            key={item.id}
                            className="dropdown-item"
                            onClick={() => edit(item.id)}
                          >
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={() => del(item.id)}
                          >
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <></>
                  )}
                  <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                  />
                  {/* <div className="media-body"> */}
                  <h5 className="mt-0">{item.user_name}</h5>
                  <div>
                    <ReactTimeAgo date={JSON.parse(item.date)} locale="en-US" />
                  </div>

                  <p>
                    {item.description}{" "}
                    {item.hash &&
                      item.hash.length > 0 &&
                      item.hash.map((hashTag, hasindex) => {
                        return (
                          <span key={hasindex} className="hashtag">
                            {hashTag}
                          </span>
                        );
                      })}
                  </p>
                  <Slider {...settings}>
                    {item.imageURL &&
                      item.imageURL.length > 0 &&
                      item.imageURL.map((singleImage) => {
                        console.log("singleImage:", singleImage);
                        return (
                          <div key={singleImage.file}>
                            {singleImage.type.includes("image") ? (
                              <img
                                src={singleImage.file}
                                alt="Post Image"
                                className="img"
                              />
                            ) : (
                              <video className="img">
                                <source src={singleImage.file}></source>
                              </video>
                            )}
                          </div>
                        );
                      })}
                  </Slider>
                  
                  <div className="text-muted mt-2" id="iconId">
                    <div className="mediaIcon1">
                      <span
                        id={setColor(item.like) === "gry" ? "gry" : "blue"}
                        onClick={() => likePost(item.id, item.like)}
                      >
                        <i className="fa-sharp fa-solid fa-thumbs-up fa-2xl" />
                      </span>
                      <p className="likeCount">
                        {item.like === undefined ? " " : item.like.length}
                      </p>
                    </div>
                    <div className="mediaIcon2">
                      <span
                        id={setColor(item.comment) === "gry" ? "gry" : "blue"}
                        onClick={() =>
                          commentPost(item.id, item.comment, index)
                        }
                      >
                        {console.log("index : ", index)}
                        {console.log("value of showTextBox :", showTextBox)}
                        <i className="fa-sharp fa-solid fa-comments fa-2xl" />
                      </span>
                    </div>
                  </div>

                  <div className={favCss ? "mediaIconFav3" : "mediaIcon3"}>
                    <span
                      id={setColorOfHeart(item.fav) === "gry" ? "gry" : "red"}
                      onClick={() => favPost(item.id, item.fav)}
                    >
                      <i className="fa-sharp fa-solid fa-heart fa-2xl" />
                    </span>
                    <p className="favCount">
                      {item.fav === undefined ? " " : item.fav.length}
                    </p>
                  </div>
                </div>
                {showTextBox === index ? (
                  <div className="com">
                    <div className="showComment">
                      {item.comment === undefined
                        ? ""
                        : item.comment.map((c) => {
                            return (
                              <>
                                <li>
                                  {c.user_name} : {c.text}
                                  <ReactTimeAgo
                                    date={JSON.parse(c.date)}
                                    locale="en-US"
                                    id="timeAgo"
                                  />
                                </li>
                              </>
                            );
                          })}
                    </div>
                    <div className="input-group mb-3" id="commentSection">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add comment"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        id="commentTextBox"
                        value={text}
                        onChange={commentText}
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="commnetButton"
                          onClick={() => commentSubmit(item.id, item.comment)}
                        >
                          POST
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  " "
                )}
              </div>
              {/* </div> */}
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
};

export default ShowPost;
