import {
  Avatar,
  CardHeader,
  CardMedia,
  Container,
  Card,
  Typography,
  TextField,
  Button,
  IconButton,
  CardContent,
  CardActions,
} from "@material-ui/core";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import CommentIcon from "@material-ui/icons/Comment";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { fbDB } from "../firebase/firebase";
import { flexbox } from "@material-ui/system";

const PostCard = (props) => {
  // props has info of current post
  // info of user who created this post
  const [userInfo, setUserInfo] = useState("");
  const [currComments, setCurrComments] = useState(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComment, setShowComment] = useState("false");
  // currentUser is a object
  let { currentUser, profilePicture } = useContext(AuthContext);

  let viewComment = () => {
    if (showComment) {
      setShowComment(false);
    } else {
      setShowComment(true);
    }
  };
  // information about post
  useEffect(() => {
    let uid = props.post.uid;
    fbDB
      .collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        setUserInfo(snapshot.data());
      });
  }, []);

  // fetch comments in this post from props
  useEffect(() => {
    let commentsList = props.post.comments;
    setCurrComments(commentsList);
  }, []);

  let handleComment = (e) => {
    setComment(e.target.value);
  };

  let postComment = async () => {
    let commenterUid = currentUser.uid;
    let postId = props.post.pid;
    let commentObj = {
      uid: commenterUid,
      comment: comment,
      commenterPhoto: profilePicture,
    };

    let snapShopt = await fbDB.collection("posts").doc(postId).get();
    let postInfo = snapShopt.data();
    postInfo.comments.push(commentObj);
    await fbDB.collection("posts").doc(postId).set(postInfo);
    setComment("");
  };
  let hadnleLikeButton = async () => {
    let snapShot = await fbDB.collection("posts").doc(props.post.pid).get();
    let snapShotData = snapShot.data();
    let likesArr = snapShotData.likes;
    let currentUid = currentUser.uid;
    if (liked) {
      let newData = likesArr.filter((uid) => {
        return uid !== currentUid ? true : false;
      });
      snapShotData.likes = [...newData];
      await fbDB.collection("posts").doc(props.post.pid).set(snapShotData);
      setLiked(false);
      // console.log("unliked");
    } else {
      snapShotData.likes.push(currentUid);
      await fbDB.collection("posts").doc(props.post.pid).set(snapShotData);
      // console.log("liked");
      setLiked(true);
    }
    // let likerUid = currentUser.uid;
    // let postId = props.post.pid;
    // // let likeObj = {
    // //   uid: commenterUid,
    // //   comment: comment,
    // //   commenterPhoto:currentUser.photo
    // // };

    // let snapShopt = await fbDB.collection("posts").doc(postId).get();
    // let postInfo = snapShopt.data();
    // postInfo.likes.push(likerUid);
    // await fbDB.collection("posts").doc(postId).set(postInfo);
    // setLiked(true);
  };
  let handleSaveButton = async () => {
    let snapShot = await fbDB.collection("users").doc(currentUser.uid).get();
    let snapShotData = snapShot.data();
    let savedArr = snapShotData.saved;
    if (saved) {
      // delete pid from saved
      let newData = savedArr.filter((data) => {
        return data !== props.post.pid ? true : false;
      });
      snapShotData.saved = [...newData];
      await fbDB.collection("users").doc(currentUser.uid).set(snapShotData);
      setSaved(false);
    } else {
      snapShotData.saved.push(props.post.pid);
      await fbDB.collection("users").doc(currentUser.uid).set(snapShotData);
      setSaved(true);
    }
  };
  return (
    <Container
      style={{
        position: "relative",
        margin: "0",
        height: "100vh",
        padding: "0",
      }}
    >
      <Card
        style={{
          position: "relative",
          marginBottom: "3rem",

          height: "100vh",
        }}
      >
        <span>
          <Avatar
            src={userInfo ? userInfo.profilePictureUrl : ""}
            size="large"
            style={{
              display: "inline-block",
              position: "absolute",
              top: "2rem",
              left: "1rem"
            }}
          ></Avatar>
          <Typography
            style={{
              display: "inline-block",
              position: "absolute",
              top: "2rem",
              left: "4rem"
            }}
          >
            {userInfo.userName}
          </Typography>
        </span>
        <CardContent
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <div
            className="video-container"
            style={{
              height: "100%",
              width: "20rem",
              marginBottom: "2rem",
              scrollSnapType: "y mandatory",
            }}
          >
            <video
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
              src={props.post.videoURL}
              loop={true}
              controls={true}
              muted={true}
            ></video>
          </div>
        </CardContent>
      </Card>
      <div style={{ position: "absolute", top: "10rem" }}>
        <Typography variant="h5">Comments</Typography>'
        <TextField
          varaint="outlined"
          label="Add a Comment"
          size="small"
          value={comment}
          onChange={(e) => handleComment(e)}
        ></TextField>
        <Button variant="contained" color="primary" onClick={postComment}>
          Post Comment
        </Button>
        {showComment ? (
          <div
            style={{
              position: "absolute",
              top: "6rem",
              left: "1rem",
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            {currComments
              ? currComments.map((comment) => {
                  return (
                    <div style={{ display: "flex" }}>
                      <Avatar src={currentUser.userPhoto}></Avatar>
                      <Typography key={comment} variant="h6" size="small">
                        {comment.comment}
                      </Typography>
                    </div>
                  );
                })
              : ""}
          </div>
        ) : (
          ""
        )}
      </div>

      <IconButton
        style={{
          position: "absolute",
          bottom: "20rem",
          right: "2rem",
          color: "red",
        }}
        onClick={hadnleLikeButton}
      >
        {liked ? (
          <FavoriteIcon fontSize="large" style={{ fill: "red" }}></FavoriteIcon>
        ) : (
          <FavoriteBorderOutlinedIcon fontSize="large"></FavoriteBorderOutlinedIcon>
        )}
      </IconButton>
      <IconButton
        onClick={viewComment}
        style={{
          position: "absolute",
          bottom: "10rem",
          right: "2rem",
        }}
      >
        <CommentIcon fontSize="large"></CommentIcon>
      </IconButton>
      <IconButton
        onClick={handleSaveButton}
        style={{
          position: "absolute",
          bottom: "15rem",
          right: "2rem",
        }}
      >
        {saved ? (
          <BookmarkIcon
            fontSize="large"
            style={{ fill: "black" }}
          ></BookmarkIcon>
        ) : (
          <BookmarkBorderOutlinedIcon fontSize="large"></BookmarkBorderOutlinedIcon>
        )}
      </IconButton>
    </Container>
  );
};

export default PostCard;
