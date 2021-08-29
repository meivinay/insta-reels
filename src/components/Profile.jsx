import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from "@material-ui/core";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { makeStyles } from "@material-ui/styles";
import GridOnIcon from "@material-ui/icons/GridOn";
import TurnedInNotSharpIcon from "@material-ui/icons/TurnedInNotSharp";
import img from "../img.jpg";
import vid from "../v1.mp4";
import SavedPosts from "./SavedPosts";
import { useEffect } from "react";
import { fbDB } from "../firebase/firebase";
import UserPosts from "./UserPosts";
import HomeIcon from '@material-ui/icons/Home';
import { Link } from "react-router-dom";
const Profile = () => {
  let { currentUser, displayName, profilePicture } = useContext(AuthContext);
  const [savedPostsUrl, setSavedPostsUrl] = useState([]);
  // let [uid, setUid] = useState("");
  let [isGrid, setGrid] = useState(true);
  let [isSaved, setSaved] = useState(false);

  let useStyles = makeStyles({
    border: {
      border: "1px solid black",
    },
    borderTop: {
      borderTop: "1px solid red",
    },
    height: {
      height: "3rem",
    },
    flexRow: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    containerPaddingNone: {
      padding: "0",
    },
    profile: {
      postion: "absolute",
      top: "5rem",
      right: "3rem",
    },
    logOut: {
      position: "absolute",
      top: "8rem",
      right: "3rem",
    },
  });

  let classes = useStyles();
  let showGrid = () => {
    if (isGrid === false) {
      setGrid(true);
      setSaved(false);    
    }
  };
  let showSaved = () => {
    if (isSaved === false) {
      setSaved(true);
      setGrid(false);
    }
  };

  useEffect(() => {
    let uid = currentUser.uid;
    if (uid) {
      fbDB
        .collection("users")
        .doc(uid)
        .get()
        .then(async (snapShot) => {
          let snapShotData = snapShot.data();

          let savedPostsPidArr = snapShotData.saved;
          let allVideoUrl = [];

          for (let i = 0; i < savedPostsPidArr.length; i++) {
            let pid = savedPostsPidArr[i];
            let videoUrl = await getPosts(pid);
            allVideoUrl.push(videoUrl);
          }
          setSavedPostsUrl(allVideoUrl);

          async function getPosts(pid) {
            return new Promise(async (resolve, reject) => {
              let snapShot = await fbDB.collection("posts").doc(pid).get();

              let snapShotData = snapShot.data();
              let videoUrl = snapShotData.videoURL;

              resolve(videoUrl);
            });
          }
        });
    }
  }, []);
  return (
    <>
      <Container
        className={` ${classes.containerPaddingNone}`}
      >
        <Card className={classes.flexRow}>
          <CardMedia >
            <Avatar
              src={profilePicture}
              style={{ height: "10rem", width: "10rem" }}
            ></Avatar>
          </CardMedia>
          <CardContent
            className={` ${classes.containerPaddingNone}`}
          >
            <Typography variant="h6">{displayName}</Typography>
          </CardContent>
          <Link to="/">
          <IconButton>
          <HomeIcon></HomeIcon>
          </IconButton>
          </Link>
        </Card>
      </Container>
      <Container
        className={`${classes.containerPaddingNone} ${classes.flexRow}`}
      >
        <IconButton onClick={showGrid}>
          <GridOnIcon></GridOnIcon>
        </IconButton>
        <IconButton onClick={showSaved}>
          <TurnedInNotSharpIcon></TurnedInNotSharpIcon>
        </IconButton>
      </Container>

      {isSaved ? (
        <SavedPosts savedPostsUrl={savedPostsUrl}></SavedPosts>
      ) : (
        <UserPosts></UserPosts>
      )}
    </>
  );
};

export default Profile;
