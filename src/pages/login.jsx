import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import React, { useContext, useRef, useState } from "react";
import { ModeContext } from "../contexts/Mode";
import { useTranslation } from "react-i18next";

function Login() {
  const { dark } = useContext(ModeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const EmailRef = useRef(null);
  const PasswordRef = useRef(null);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (login.email.trim().length < 1 || login.password.trim().length < 1) {
      const newError = {
        email: "",
        password: "",
      };
      if (login.email.trim().length < 1) {
        newError.email = t("email is Required");
        EmailRef.current.focus();
      }
      if (login.password.trim().length < 1) {
        newError.password = t("password is Required");
      }
      return setError(() => ({
        ...error,
        email: newError.email,
        password: newError.password,
      }));
    }
    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: login.email,
          password: login.password,
        }),
      });
      const data = await response.json();
      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        window.location.href = "/";
        return data.user;
      }
      if (login.email.length < 1 || login.password.length < 1) {
        const newError = {
          email: "",
          password: "",
        };
        if (login.email.length < 1) {
          newError.email = t("email is Required");
        }
        if (login.password.length < 1) {
          newError.password = t("password is Required");
        }
        setError(() => ({
          ...error,
          email: newError.email,
          password: newError.password,
        }));
      } else {
        setError(() => ({
          ...error,
          email: t("Invalid email or password"),
          password: t("Invalid email or password"),
        }));
      }
    } catch (error) {
      return error;
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
          {t("Login")}
        </Typography>
        <form
          onSubmit={handleLogin}
          noValidate
          style={{ width: "100%", marginTop: "24px" }}
        >
          <TextField
            variant="outlined"
            color="info"
            margin="normal"
            required
            fullWidth
            inputRef={EmailRef}
            id="email"
            label={t("Email Address")}
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                PasswordRef.current.focus();
              }
            }}
            sx={{
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
            }}
            value={login.email}
            helperText={error.email ? error.email : false}
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
          <TextField
            variant="outlined"
            margin="normal"
            color="info"
            required
            fullWidth
            inputRef={PasswordRef}
            name="password"
            label={t("Password")}
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            sx={{
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
            }}
            value={login.password}
            helperText={error.password ? error.password : false}
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
          <Button
            fullWidth
            variant="contained"
            color="info"
            type="submit"
            sx={{ marginTop: 3 }}
          >
            {t("Sign In")}
          </Button>
          <Grid container justifyContent={isRTL ? "flex-end" : "flex-start"}>
            <Grid>
              <Link
                to={"/signup"}
                variant="body2"
                style={{
                  textDecoration: "none",
                  color: dark ? "rgb(255, 255, 255,0.6)" : "rgb(0, 0, 0,0.6)",
                }}
              >
                {t("Don't have an account? Sign Up")}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default React.memo(Login);
