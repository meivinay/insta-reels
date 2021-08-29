import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import React from "react";
import crousel from "./crousel.png";
import {
  Button,
  Container,
  Grid,
  TextField,
  Card,
  CardActions,
  CardContent,
  Typography,
  makeStyles,
  CardMedia,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import img from "./instaLogo.png";
import { fbStorage } from "../firebase/firebase";
const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErr] = useState("");

  let { login,currentUser } = useContext(AuthContext);
  let useStyles = makeStyles({
    logo: {
      height: "30%",
      backgroundSize: "contain",
    },
    flexColumn: {
      display: "flex",
      flexDirection: "column",
    },
    crousel: {
      height: "30rem",
      width: "100%",
      backgroundColor: "lightGray",
    },
    rightBox: {
      height: "20rem",
      width: "100%",
    },
    textBoxes: {
      height: "50%",
      width: "100%",
      justifyContent: "space-around",
    },
  });
  let classes = useStyles();
  let hadnleLogin = async () => {
    try {
      await login(email, password); // we getting a promise from this
      // get name and dp
      // let dpUrl = fbStorage.ref(`/profilePhoto/${}`)
      props.history.push("/");
    } catch (err) {
      setErr(err.message);
      setEmail("");
      setPassword("");
      // console.log(err.message);
      alert(err.message);
    }
  };

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item sm={5}>
            <img src={crousel} alt="" className={classes.crousel}></img>
          </Grid>
          <Grid item sm={5}>
            <Card variant="outlined" className={classes.rightBox}>
              <CardMedia image={img} className={classes.logo}></CardMedia>
              <CardContent
                className={`${classes.flexColumn} ${classes.textBoxes}`}
              >
                <TextField
                  id="outlined-basic"
                  label="Email"
                  type="email"
                  value={email}
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <TextField
                  label="Password"
                  value={password}
                  variant="outlined"
                  type="password"
                  size="small"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></TextField>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={hadnleLogin}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
            <Card variant="outlined">
              <Typography>
                Don't have an account?
                <Link to="/signup">SignUp</Link>
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Login;
