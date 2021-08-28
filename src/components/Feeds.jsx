import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import {uuid} from "uuidv4";
import { fbDB, fbStorage } from "../firebase/firebase";
import PostCard from "../components/PostCard";

const Feeds = (props) => {
  const [video, setVideo] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  let { signout, currentUser } = useContext(AuthContext);
  let handleSignout = async () => {
    await signout();
    props.history.push("/login");
  };

  let handleInput = (e) => {
    let videofile = e.target.files[0];
    console.log(videofile);
    setVideo(videofile);
  };
  let handleUpload = async () => {
    try {
      // console.log("upload");
      let uid = currentUser.uid;
      // console.log(currentUser);
      // console.log(uid);
      console.log(video);
      let videoUploadPromise = fbStorage.ref(`/profilePhoto/${uid}/${Date.now()}.mp4`).put(video);
      videoUploadPromise.on("state_changed",progress, error, completion);
      function progress(){
        console.log("uploading");
      }
      function error(){
        console.log("error")
      }
      async function completion(){
        let videoUrl = await videoUploadPromise.snapshot.ref.getDownloadURL();
        // console.log("upload completenpm ");
        let pid = uuid();
        await fbDB.collection("posts").doc(pid).set({
          pid:pid,
          uid:uid,
          comments:[],
          likes:[],
          videoURL:videoUrl
        })
        let document = await fbDB.collection("users").doc(uid).get();
        let userObj = document.data();
        userObj.postsCreated.push(pid);
        await fbDB.collection("users").doc(uid).set(userObj);
      }
    } catch(e) {
      console.log("error " +e);
    }
  };


  useEffect(() => {
    let obj = {
      root: null,
      threshold: "0.9",
    };
    function callback(allVideo) {
      // console.log("allamsdkamsd");
      // console.log(allVideo);
      allVideo.forEach((video) => {
        let videoTag = video.target.children[0];
        videoTag.play().then(() => {
          if (video.isIntersecting === false) {
            videoTag.pause();
            // console.log("pause");
          }
        });
      });
    } 
    let observer = new IntersectionObserver(callback, obj);
    let element = document.querySelectorAll(".video-container");
    // console.log(element);
    element.forEach((el) => {
      observer.observe(el);
    });
  }, [allPosts]);

  useEffect(()=>{
       fbDB.collection("posts").get().then(snapshot=>{
         console.log("posts");
        // console.log(snapshot.docs[0].data())
        let allPosts = snapshot.docs.map(doc=>{
          return doc.data();
        })
        setAllPosts(allPosts);
       })
  },[])
  return (
    <>
        <button onClick={handleSignout}>Logout</button>
        <br></br>
        <input
        placeholder="upload"
          type="file"
          onChange={(e) => {
            handleInput(e);
          }}
        ></input>
        
        <br></br>
        <Button color="red" variant="contained" onClick={ handleUpload}>
          Upload
        </Button>
      <div style={{display:"flex",flexDirection:"column"}}>
      {
        allPosts.map((post)=>{
          return <PostCard key={post.pid} post={post}></PostCard>
        })
      }
      </div>
    </>
  );
};  

export default Feeds;
