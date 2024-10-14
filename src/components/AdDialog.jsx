import {
  Typography,
  Button,
  AppBar,
  Slide,
  Toolbar,
  IconButton,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

import React, { useCallback, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid2";

import { forwardRef, useContext } from "react";
import { Contax } from "../contexts/Contax";

import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AdDialog({ open, close }) {
  const { t, i18n } = useTranslation();
  const { userInfo } = useContext(UserContext);
  const { dispatch } = useContext(Contax);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState({ title: "", body: "" });
  const formRef = useRef(null);
  const titleRef = useRef(null);

  const handleOnEntered = () => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  };
  const handleClose = useCallback(() => {
    setDetails({ title: "", body: "" });
    setError(null);
    close();
  }, [close]);

  const addTodoToAPI = useCallback(
    async (e) => {
      e.preventDefault();
      if (details.title.trim().length < 1 && details.body.trim().length < 1) {
        setError(t("you Cannot add an empty task"));
        return;
      }
      const now = new Date();
      const formattedDate = now.toLocaleString(
        i18n.language === "ar" ? "ar-JO" : "en-US",
        {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          hour12: true,
        }
      );
      try {
        const response = await fetch("http://localhost:1337/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              Title: details.title,
              body: details.body,
              Time: formattedDate,
              userId: userInfo.Id,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add the task.");
        }
        const result = await response.json();
        dispatch({
          type: "CREATE_TODOS_SUCCESS",
          payload: result.data,
        });
        handleClose();
      } catch (error) {
        console.error("Error:", error);
        dispatch({ type: "CREATE_TODOS_FAILURE", payload: error.message });
      }
    },
    [t, i18n.language, userInfo, setError, dispatch, details, handleClose]
  );

  const isRTL = i18n.language === "ar";

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        TransitionProps={{ onEntered: handleOnEntered }}
        sx={{ zIndex: 10002 }}
      >
        <form noValidate onSubmit={addTodoToAPI} ref={formRef}>
          <AppBar
            sx={{ position: "relative", direction: isRTL ? "rtl" : "ltr" }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  marginLeft: isRTL ? "0" : "16px",
                  marginRight: isRTL ? "16px" : "0",
                }}
                color={"inherit"}
              >
                {t("Create a new Todo")}
              </Typography>
              <Button
                autoFocus
                color="inherit"
                sx={{
                  display: "block",
                  color: "white",
                  textAlign: "center",
                }}
                type="submit"
              >
                {t("Submit")}
              </Button>
            </Toolbar>
          </AppBar>

          <div
            style={{
              padding: "30px",
              width: "98%",
              marginLeft: 13,
              marginTop: 24,
            }}
          >
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  inputRef={titleRef}
                  variant="outlined"
                  fullWidth
                  id="todoTitle"
                  label={t("Todo Title")}
                  name="title"
                  onChange={(e) =>
                    setDetails({ ...details, title: e.target.value })
                  }
                  sx={{
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
                  autoComplete="todoTitle"
                  multiline
                  minRows={1}
                  maxRows={5}
                  helperText={error ? error : ""}
                  error={!!error}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (formRef.current) {
                        formRef.current.requestSubmit();
                      }
                    }
                  }}
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
              <Grid size={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="todoDetails"
                  label={t("Todo Details")}
                  name="body"
                  onChange={(e) =>
                    setDetails({ ...details, body: e.target.value })
                  }
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
                  autoComplete={t("Todo Details")}
                  multiline
                  minRows={1}
                  maxRows={5}
                  helperText={error ? error : ""}
                  error={!!error}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (formRef.current) {
                        formRef.current.requestSubmit();
                      }
                    }
                  }}
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
            </Grid>
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default React.memo(AdDialog);

AdDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
