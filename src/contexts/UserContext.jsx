import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({
    Id: null,
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
