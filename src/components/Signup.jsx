import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { fbDB, fbStorage } from "../firebase/firebase";
import {
  Card,
  Grid,
  Button,
  TextField,
  CardMedia,
  CardContent,
  CardActions,
  makeStyles,
  Input,
} from "@material-ui/core";




const Signup = (props) => {

  let useStyles = makeStyles({
    flexColumn: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
    },
    cardSize: {
      height: "30rem",
      width: "20rem",
    },
    cardContentSize: {
      height: "60%",
      width: "100%",
    },
  });
  let classes = useStyles();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfilePicture] = useState(null);
  const [err, setErr] = useState("");

  let { signup } = useContext(AuthContext);
  const handleFileSubmit = (e) => {
    let fileObject = e.target.files[0];
    setProfilePicture(fileObject);
  };
  const handleSignup = async () => {
    try {
      let response = await signup(email, password);
      let uid = response.user.uid;
      // subscription
      let uploadProfilePicture = fbStorage
        .ref(`/profilePhoto/${uid}/profilePhoto.jpg`)
        .put(profile);
      uploadProfilePicture.on("state-changed", progress, error, completion);
      function progress() {
        console.log("uploading profile picture");
      }
      function error() {
        alert(error);
      }
      async function completion() {
        let profilePictureUrl =
          await uploadProfilePicture.snapshot.ref.getDownloadURL();
        fbDB.collection("users").doc(uid).set({
          email: email,
          userID: uid,
          userName: userName,
          profilePictureUrl: profilePictureUrl,
          postsCreated:[]
        });
        props.history.push("/");
      }
    } catch (err) {
      setErr(err.message);
    }
  };
  return (
    <>
      <Grid container>
        <Grid item sm="6">
          <Card className={classes.cardSize}>
            <CardMedia>image</CardMedia>
            <CardContent
              className={`${classes.flexColumn} ${classes.cardContentSize}`}
            >
              <TextField
                value={userName}
                variant="outlined"
                label="User Name"
                size="small"
                type="text"
                onChange={(e) => setUserName(e.target.value)}
              ></TextField>
              <TextField
                variant="outlined"
                label="Email"
                size="small"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></TextField>
              <TextField
                variant="outlined"
                value={password}
                label="Password"
                size="small"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></TextField>
              <Input
                type="file"
                accept="image/*"
                placeholder="Upload Profile"
                onChange={(e) => handleFileSubmit(e)}
              ></Input>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSignup}
              >
                Sign Up
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Signup;
