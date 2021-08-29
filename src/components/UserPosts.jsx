import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { fbDB } from "../firebase/firebase";
import { Container, ImageList, ImageListItem } from "@material-ui/core";
import { Typography } from "@material-ui/core";
const UserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    let uid = currentUser.uid;
    fbDB
      .collection("users")
      .doc(uid)
      .get()
      .then(async (snapShot) => {
        let data = snapShot.data();

        let postsCreated = data.postsCreated;
        let allVideoUrl = [];
        if (postsCreated) {
          for (let i = 0; i < postsCreated.length; i++) {
            let pid = postsCreated[i];
            let videoUrl = await getPosts(pid);
            allVideoUrl.push(videoUrl);
          }

          async function getPosts(pid) {
            return new Promise(async (resolve, reject) => {
              let snapShot = await fbDB.collection("posts").doc(pid).get();

              let snapShotData = snapShot.data();
              let videoUrl = snapShotData.videoURL;

              resolve(videoUrl);
            });
          }
        }

        setUserPosts(allVideoUrl);
      });
  }, []);
  return (
    <Container styles={{ marginTop: "5rem" }}>
      {userPosts.length !== 0 ? (
        <ImageList cols={3} rowHeight={500}>
          {userPosts.map((url) => {
            return (
              <ImageListItem key={url} cols={1}>
                <video
                  src={url}
                  alt=""
                  style={{ objectFit: "cover", height: "100%", width: "100%" }}
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      ) : (
        <Typography varinat="h1">
          Oops no post has been created yet by the user
        </Typography>
      )}
    </Container>
  );
};

export default UserPosts;
