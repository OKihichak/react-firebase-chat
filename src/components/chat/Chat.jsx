import { useEffect, useState, useRef } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../lib/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";

// For handling audio recording
let mediaRecorder;
let audioChunks = [];

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [Text, setText] = useState("");
  const [chat, setChat] = useState();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [recording, setRecording] = useState(false); // To track if recording is in progress
  const [audioUrl, setAudioUrl] = useState(null); // Store audio URL

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  // Handle image upload
  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Handle voice recording using the mic button
  const handleVoiceRecording = async () => {
    if (recording) {
      // Stop recording
      mediaRecorder.stop();
      setRecording(false);
    } else {
      // Start recording
      setRecording(true);
      audioChunks = [];

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
          const audioFile = new File([audioBlob], "voiceMessage.mp3", { type: "audio/mpeg" });

          const uploadedAudioUrl = await upload(audioFile);
          setAudioUrl(uploadedAudioUrl);
          handleSend(uploadedAudioUrl); // Only send the audio message
        };
      });
    }
  };

  const handleSend = async (audioUrl = null) => {
    if (Text === "" && !audioUrl) return; // Only send when text or audioUrl is present

    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: Text || "", // Set text to "Voice Message" if it's an audio message
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
          ...(audioUrl && { audioUrl }), // Attach audio message URL if available
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = Text || "Voice Message";
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: "",
    });

    setText("");
    setAudioUrl(null);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Hello I'm new User here</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              {message.text && <p>{message.text}</p>}
              {message.audioUrl && (
                <div className="audioMessage">
                <audio controls>
                  <source src={message.audioUrl} type="audio/mpeg" />
                </audio>
              </div>
              )}
              <span>{format(message.createdAt.toDate())}</span>
            </div>
          </div>
        ))}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          {/* Button for image upload */}
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />

          {/* Button for camera (this can be extended later) */}
          <img src="./camera.png" alt="Camera" />

          {/* Button for voice message (mic) */}


          
          <img
            src={recording ? "./mic-active.png" : "./mic.png"}
            alt="Mic"
            onClick={handleVoiceRecording}
          />
          
        </div>

        {/* Change input when recording */}
        <input
          type="text"
          placeholder={
            recording
              ? "You are recording a voice message..."
              : isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={Text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked || recording}
        />

        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={() => handleSend(null)} // Send only text or image if no audio
          disabled={isCurrentUserBlocked || isReceiverBlocked || recording}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
