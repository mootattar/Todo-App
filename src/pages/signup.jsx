// Import MUI components
import Avatar from "@mui/material/Avatar";
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../fireBaseConfig";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
// Import React hooks
import React, { useContext, useRef, useState } from "react";

// Import React Router Link
import { Link } from "react-router-dom";

// Import i18next
import { useTranslation } from "react-i18next";

// Import ModeContext
import { ModeContext } from "../contexts/Mode";
import { UserContext } from "../contexts/UserContext";

function Signup() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  // State for errors
  const [error, setError] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for signup form
  const [signup, setSignup] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Refs for inputs
  const UserRef = useRef(null);
  const EmailRef = useRef(null);
  const PasswordRef = useRef(null);
  const ConfirmRef = useRef(null);

  // Translation
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // style of inputs
  const style = {
    "& .MuiInputLabel-asterisk": {
      transition: "none",
    },
    "& .MuiInputBase-root": {
      direction: isRTL ? "rtl" : "ltr",
    },
    "& .MuiInputBase-input": {
      textAlign: isRTL ? "right" : "left",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      textAlign: isRTL ? "right" : "left",
    },
    "& .MuiInputLabel-root": {
      left: isRTL ? "inherit" : "2px",
      right: isRTL ? "32px" : "inherit",
      transformOrigin: isRTL ? "right" : "left",
    },
    "& .MuiInputLabel-shrink": {
      transform: isRTL
        ? "translate(16px, -9px) scale(0.75)"
        : "translate(14px, -9px) scale(0.75)",
    },
  };

  const { dark } = useContext(ModeContext);

  // fire base
  const signUp = async (e) => {
    e.preventDefault();
    if (
      signup.userName.trim().length < 1 ||
      signup.email.trim().length < 1 ||
      signup.password.trim().length < 1
    ) {
      const newError = {
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
      if (signup.userName.trim().length < 1) {
        newError.userName = t("User Name cannot be empty");
        UserRef.current.focus();
      }
      if (signup.email.trim().length < 1) {
        newError.email = t("Email cannot be empty");
      }
      if (signup.password.trim().length < 1) {
        newError.password = t("Password cannot be empty");
      }
      if (signup.confirmPassword !== signup.password) {
        newError.confirmPassword = t("Passwords do not match");
      }
      return setError(() => ({
        ...error,
        userName: newError.userName,
        email: newError.email,
        password: newError.password,
        confirmPassword: newError.confirmPassword,
      }));
    }
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signup.email,
        signup.password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: signup.userName,
      });
      await setDoc(doc(db, "users", user.uid), {
        name: signup.userName,
        email: signup.email,
        createdAt: new Date(),
      });
      setUserInfo({
        ...userInfo,
        Id: user.uid,
        userName: user.displayName,
        email: user.email,
      });
      window.location.href = "/";
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div
        style={{
          marginTop: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: "info.main", marginTop: "8px" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("Sign Up")}
        </Typography>
        <form
          onSubmit={(e) => signUp(e)}
          style={{ width: "100%", marginTop: "24px" }}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                color="info"
                required
                fullWidth
                inputRef={UserRef}
                id="username"
                label={t("User Name")}
                name="username"
                autoComplete="username"
                autoFocus
                value={signup.userName}
                onChange={(e) =>
                  setSignup({ ...signup, userName: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    EmailRef.current.focus();
                  }
                }}
                sx={style}
                helperText={error ? error.userName : ""}
                error={!!error.userName}
                slotProps={{
                  formHelperText: {
                    style: {
                      textAlign: isRTL ? "right" : "left",
                    },
                  },
                  input: {
                    dir: isRTL ? "rtl" : "ltr",
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                color="info"
                required
                fullWidth
                inputRef={EmailRef}
                id="email"
                label={t("Email Address")}
                name="email"
                autoComplete="email"
                value={signup.email}
                onChange={(e) =>
                  setSignup({ ...signup, email: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    PasswordRef.current.focus();
                  }
                }}
                sx={style}
                helperText={error ? error.email : ""}
                error={!!error.email}
                slotProps={{
                  formHelperText: {
                    style: {
                      textAlign: isRTL ? "right" : "left",
                    },
                  },
                  input: {
                    dir: isRTL ? "rtl" : "ltr",
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                color="info"
                required
                fullWidth
                inputRef={PasswordRef}
                name="password"
                label={t("Password")}
                type="password"
                id="password"
                autoComplete="current-password"
                value={signup.password}
                onChange={(e) =>
                  setSignup({ ...signup, password: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    ConfirmRef.current.focus();
                  }
                }}
                sx={style}
                helperText={error ? error.password : ""}
                error={!!error.password}
                slotProps={{
                  formHelperText: {
                    style: {
                      textAlign: isRTL ? "right" : "left",
                    },
                  },
                  input: {
                    dir: isRTL ? "rtl" : "ltr",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                color="info"
                required
                fullWidth
                inputRef={ConfirmRef}
                name="confirmPassword"
                label={t("Confirm Password")}
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={signup.confirmPassword}
                onChange={(e) =>
                  setSignup({ ...signup, confirmPassword: e.target.value })
                }
                sx={style}
                slotProps={{
                  formHelperText: {
                    style: {
                      textAlign: isRTL ? "right" : "left",
                    },
                  },
                  input: {
                    dir: isRTL ? "rtl" : "ltr",
                  },
                }}
                helperText={error ? error.confirmPassword : ""}
                error={!!error.confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="info"
            sx={{ marginTop: 3 }}
            type="submit"
          >
            {t("Sign Up")}
          </Button>
          <Grid container justifyContent={isRTL ? "flex-end" : "flex-start"}>
            <Grid>
              <Link
                to={"/login"}
                variant="body2"
                style={{
                  textDecoration: "none",
                  color: dark
                    ? "rgba(255, 255, 255, 0.6)"
                    : "rgba(0, 0, 0, 0.6)",
                }}
              >
                {t("Already have an account? Sign in")}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default React.memo(Signup);
