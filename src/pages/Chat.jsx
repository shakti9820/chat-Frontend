import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host,getData } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(async () => {
    try{
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      const token=localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const {data }= await axios.get(`${getData}`);
      // console.log(data);
      setCurrentUser(
        data
      );
    }
  }
    catch{
      localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    // if (currentUser) {
    //   const token=localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    //   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //     const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
    //     // console.log(data);
    //     setContacts(data.data);
     
    // }


    try{
        if (currentUser) {
      const token=localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const {data} = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        // console.log(data);
        setContacts(data);
     
    }
  }
    catch{
      localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
      navigate("/login");
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    // console.log(chat);
    // console.log(currentUser)
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
