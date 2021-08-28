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
} from "@material-ui/core";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { fbDB } from "../firebase/firebase";

const PostCard = (props) => {
  // props has info of current post
  // info of user who created this post
  const [userInfo, setUserInfo] = useState("");
  const [currComments, setCurrComments] = useState(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  let styles = {
    height: "100%",
    width: "100%",
    scrollSnapAlign: "start",
  };
  // currentUser is a object
  let { currentUser } = useContext(AuthContext);

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
      commenterPhoto: currentUser.photo,
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
    console.log(snapShotData);
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
      snapShotData.likes.push(currentUid)
      await fbDB
        .collection("posts")
        .doc(props.post.pid)
        .set(snapShotData);
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
    <Container style={{ border: "1px solid pink", margin: "0" }}>
      <Card style={{ marginBottom: "3rem", border: "1px solid black" }}>
        <Avatar
          src={userInfo ? userInfo.profilePictureUrl : ""}
          size="large"
          style={{ border: "1px solid red" }}
        ></Avatar>
        <div
          className="video-container"
          style={{
            height: "100vh",
            width: "20rem",
            marginBottom: "2rem",
            scrollSnapType: "y mandatory",
            border: "1px solid red",
          }}
        >
          <video
            style={styles}
            src={props.post.videoURL}
            loop={true}
            controls={true}
            muted={true}
          ></video>
        </div>
        <Typography variant="p" style={{ border: "1px solid red" }}>
          Comments
        </Typography>
        <TextField
          varaint="outlined"
          label="Add a Comment"
          size="small"
          value={comment}
          onChange={(e) => handleComment(e)}
        ></TextField>
        <Button
          vairant="contaiend"
          color="secondary"
          onClick={postComment}
        ></Button>
        <IconButton onClick={hadnleLikeButton}>
          {liked ? (
            <FavoriteIcon style={{ fill: "red" }}></FavoriteIcon>
          ) : (
            <FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon>
          )}
        </IconButton>
        <IconButton onClick={handleSaveButton}>
          {saved ? (
            <BookmarkIcon style={{ fill: "black" }}></BookmarkIcon>
          ) : (
            <BookmarkBorderOutlinedIcon></BookmarkBorderOutlinedIcon>
          )}
        </IconButton>
        {currComments
          ? currComments.map((comment) => {
              return (
                <>
                  <Avatar
                    src={currentUser.userPhoto}
                    style={{ border: "1px solid red" }}
                  ></Avatar>
                  <Typography
                    key={comment}
                    variant="p"
                    style={{ border: "1px solid red" }}
                    size="small"
                  >
                    {comment.comment}
                  </Typography>
                </>
              );
            })
          : ""}
      </Card>
    </Container>
  );
};

export default PostCard;
