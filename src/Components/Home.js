import React from "react";
import "./Home.css";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShowPost from "./ShowPost";
import {
  database,
  requestFirebaseNotificationPermission,
  onMessageListener,
} from "../Config";
import { ref, onValue, push, update, set, remove } from "firebase/database";
import { messaging } from "../Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import ProfilePage from "./ProfilePage";

export const Home = () => {
  const [postData, setPostData] = useState([]);
  const [userData, setUserData] = useState([]);
  var token;
  var userToken = [];
  var currentToken;
  const auth = getAuth();
  const user = auth.currentUser;

  var userPhoto = JSON.parse(localStorage.getItem("user"));
  var photo = userPhoto.photoUrl;
  console.log("photo url:", photo);

  onMessageListener().then((paylaoad) => {
    console.log("PAYLOAD", paylaoad);
    toast(`${paylaoad.notification.title} : ${paylaoad.notification.body}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  });

  const sendMessage = async (token) => {
    const accessToken = token;

    const FIREBASE_API_KEY =
      "AAAAmkVJRBg:APA91bHCkkQg-omxDIDJ9MoEBsqgJ2x66BuyPBakh9VSOaS027TNdvhtxecABB__JfuAG2LqMzK-J0GKoAoZIU46hGlR18mkQq6gc0QylhyX0DZrMjVWB1JouHVzE4oAe607K-0hVtsA";

    const message = {
      registration_ids: [accessToken],
      notification: {
        title: "Harshvi Trivedi",
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

  const navigate = useNavigate();

  useEffect(() => {
    const Ref = ref(database, "post/");
    onValue(Ref, (snapshot) => {
      const data = snapshot.val();
      console.log("DATA", data);
      if (data) {
        const newPost = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        newPost.reverse();
        setPostData(newPost);
        console.log("POST DATA", postData);
      }
    });
    console.log("url:", user);
  }, []);

  const goToProfilePage = () => {
    navigate("/ProfilePage");
  };

  const delUserToken = async () => {
    const Ref = ref(database, "user/");
    await onValue(Ref, (snapshot) => {
      const data = snapshot.val();
      console.log("DATA", data);
      if (data) {
        const newUser = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        console.log("POST DATA", newUser);
        newUser.map((i) => {
          if (i.user_id === user.email) {
            console.log("i:", i.id);
            const Ref = ref(database, `user/${i.id}`);
            remove(Ref).then(() => {
              alert("thank you");
            });
          }
        });
      }
    });
  };

  const handleLogOut = () => {
    delUserToken();
    navigate("/SignIn");
  };

  const handleAdd = () => {
    navigate("/AddPost");
  };

  return (
    <>
      <div className="row">
        <div
          className="col-lg-7 col-sm-9 col-md-8"
          style={{ textAlign: "end" }}
        >
          <div className="HomeDiv">
            <input
              type="text"
              placeholder="What's in your mind?"
              className="postText"
              onClick={handleAdd}
            ></input>
          </div>
        </div>
        <div
          className="col-lg-5 col-sm-3 col-md-4"
          style={{ textAlign: "end" }}
        >
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown" // Updated attribute name from "data-toggle" to "data-bs-toggle"
              aria-haspopup="true"
              aria-expanded="false"
              style={{ background: "white", border: "solid white" }}
            >
              <img
                src={photo}
                className="mr-3 rounded-circle"
                alt="Profile Picture"
                style={{ width: 40 }}
              />
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" onClick={goToProfilePage}>
                Manage Profile
              </a>
              <a class="dropdown-item" onClick={handleLogOut}>
                logOut
              </a>
            </div>
          </div>
        </div>
      </div>
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
        {postData.length > 0 && <ShowPost post={postData} />}

    </>
  );
};

export default Home;
