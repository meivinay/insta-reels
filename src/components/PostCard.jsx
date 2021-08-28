import {
  Avatar,
  CardHeader,
  CardMedia,
  Container,
  Card,
} from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import { fbDB } from "../firebase/firebase";

const PostCard = (props) => {
    console.log(props);
  const [userInfo, setUserInfo] = useState("");
  let styles = {
    height: "100%",
    width: "100%",
  };
  useEffect(() => {
    let uid = props.post.uid;
    fbDB.collection("users").doc(uid).get().then(snapshot=>{
       setUserInfo(snapshot.data())
    });
    console.log("asfdklasnnoacnancasbd0qw0gdqwbdg");
    console.log(props.post.videoUrl);
  }, []);
  return (
    <Container>
      <Card>
        <Avatar src={userInfo ? userInfo.profilePictureUrl : ""} size = "large"></Avatar>
          <div
            className="video-container"
            style={{ height: "40rem", width: "20rem" }}
          >
            <video
              style={styles}
              src={props.post.videoURL}
              loop={true}
              controls={true}
              muted={true}
            ></video>
          </div>
      </Card>
      
    </Container>
  );
};

export default PostCard;
