import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import { getData } from "../utils/APIRoutes";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Contacts({ contacts, changeChat }) {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
 
  const [currentSelected, setCurrentSelected] = useState(undefined);
  // useEffect(async () => {
  //   const data = await JSON.parse(
  //     localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
  //   );
  //   setCurrentUserName(data.username);
  
  // }, []);


  useEffect(async () => {
    
      
      const token=localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const {data }= await axios.get(`${getData}`);
      // console.log(data.username);
      setCurrentUserName(
        data.username
      );
    }
    else{
      localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
      navigate("/login");
    }
    
  }, []);
  const changeCurrentChat = (index, contact) => {
    // console.log(contact);
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {
     
      (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
           
            <h3>Chatty</h3>
            <span><Logout/></span>
          </div>
          
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
           
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #9fa6a5;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
   
    }
    .selected {
      background-color: #9a86f3;
    }
  }
   .brand span{
    margin-left: 100px;
   }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
