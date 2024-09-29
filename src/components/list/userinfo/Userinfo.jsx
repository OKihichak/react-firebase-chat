import { useUserStore } from "../../../lib/userStore";
import "./userInfo.css"


const Userinfo = () => {

  const {currentUser } = useUserStore();

    return (
      <div className='userInfo'>
        <div className="user">
            <img src={currentUser.avatar || "./avatar.png"} alt=""></img>
            <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
            <img src="./more.png" alt=""></img>
            <img src="./video.png" alt=""></img>
            <img src="./edit.png" alt=""></img>
        </div>
    

      </div>
    )
  }
  
  export default Userinfo
  