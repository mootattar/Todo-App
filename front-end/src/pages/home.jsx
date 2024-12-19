// This page shows the user's todo list, and allows them to add, edit and delete tasks.
// It also displays a loading indicator while the data is being fetched from the server.

import Todo from "../components/todo";
import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useEffect } from "react";

// mainURL
const mainUrl = import.meta.env.VITE_MAIN_URL;

const MemoizedTodo = React.memo(Todo);
const Home = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      setUserInfo({ ...userInfo, uiLoading: true });
      try {
        const response = await fetch(`${mainUrl}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserInfo({
            ...userInfo,
            Id: data.id,
            userName: data.username,
            email: data.email,
            uiLoading: false,
            imageLoading: false,
          });
        } else {
          console.error("Failed to fetch user data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUserInfo]);

  if (userInfo.uiLoading) {
    return (
      <div>
        <>
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"center"}
            width={"80vw"}
            height={"100vh"}
          >
            <CircularProgress size={100} />
          </Stack>
        </>
      </div>
    );
  } else {
    return (
      <div style={{ flexGrow: 1 }}>{userInfo.userName && <MemoizedTodo />}</div>
    );
  }
};

export default React.memo(Home);
