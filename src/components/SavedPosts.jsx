import {Container, ImageList, ImageListItem} from "@material-ui/core"

const SavedPosts = (props) => {
    return (    <Container styles={{marginTop:"5rem"}}>
        <ImageList cols={3} rowHeight={500}>
          {props.savedPostsUrl.map((url) => {
            return (
              <ImageListItem key={url} cols={1}>
                <video src={url} alt="" style={{objectFit:"cover",height:"100%",width:"100%"}}/>
              </ImageListItem>
            );
          })}
        </ImageList>
      </Container> );
}
 
export default SavedPosts;