// This page shows the user's todo list, and allows them to add, edit and delete tasks.
// It also displays a loading indicator while the data is being fetched from the server.

import Todo from "../components/Todo";
import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../fireBaseConfig";

const MemoizedTodo = React.memo(Todo);
const Home = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserInfo({
          Id: currentUser.uid,
          userName: currentUser.displayName,
          email: currentUser.email,
        });
      }
    });

    return () => unsubscribe();
  }, [setUserInfo]);

  if (!userInfo.userName) {
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
      <div style={{ flexGrow: 1 }}>
        <MemoizedTodo />
      </div>
    );
  }
};

export default React.memo(Home);
