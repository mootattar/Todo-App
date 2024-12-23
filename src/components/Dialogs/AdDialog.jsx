import {
  Typography,
  Button,
  AppBar,
  Slide,
  Toolbar,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";

import React, { useCallback, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid2";

import { forwardRef, useContext } from "react";

// any id
import { v4 as uuidv4 } from "uuid";

import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../contexts/UserContext";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";
import { useStore } from "../../contexts/ReducerContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../fireBaseConfig";
function AdDialog({ open, close }) {
  const { t, i18n } = useTranslation();
  const { userInfo } = useContext(UserContext);
  const { dispatch } = useStore();
  const [error, setError] = useState(null);
  const { handleShow } = useToast();
  const [details, setDetails] = useState({
    title: "",
    body: "",
    cat: "Other",
  });
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const categories = [
    {
      name: "Home",
    },
    {
      name: "Personal",
    },
    {
      name: "Study",
    },
    {
      name: "Health",
    },
    {
      name: "Other",
    },
  ];

  const handleChange = (e) => {
    setDetails({
      ...details,
      cat: e.target.value,
    });
  };

  const handleOnEntered = () => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  };
  const PasswordRef = useRef(null);
  const handleClose = useCallback(() => {
    setDetails({ title: "", body: "", cat: "Other" });
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

      const localTodo = {
        id: uuidv4(),
        Title: details.title,
        body: details.body,
        Time: formattedDate,
        userId: userInfo.Id,
        ischecked: false,
        cat: details.cat,
      };

      dispatch({
        type: "CREATE_TODOS_SUCCESS",
        payload: localTodo,
      });
      handleClose();
      handleShow(t("Task added successfully"));

      try {
        await addDoc(collection(db, "todos"), localTodo);
      } catch (error) {
        console.error("Error adding document: ", error);
        setError(t("Failed to add the task."));
      }
    },
    [t, i18n.language, userInfo, dispatch, details, handleClose, handleShow]
  );

  // const addTodoToAPI = useCallback(
  //   async (e) => {
  //     e.preventDefault();
  //     if (details.title.trim().length < 1 && details.body.trim().length < 1) {
  //       setError(t("you Cannot add an empty task"));
  //       return;
  //     }
  //     const now = new Date();
  //     const formattedDate = now.toLocaleString(
  //       i18n.language === "ar" ? "ar-JO" : "en-US",
  //       {
  //         year: "numeric",
  //         month: "numeric",
  //         day: "numeric",
  //         hour: "numeric",
  //         hour12: true,
  //       }
  //     );
  //     const localTodo = {
  //       Title: details.title,
  //       body: details.body,
  //       Time: formattedDate,
  //       userId: userInfo.Id,
  //       cat: details.cat,
  //     };

  //     dispatch({
  //       type: "CREATE_TODOS_SUCCESS",
  //       payload: localTodo, // إضافة المهمة إلى الحالة محليًا
  //     });
  //     try {
  //       const response = await fetch(`${mainUrl}/api/todos`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           data: {
  //             Title: details.title,
  //             body: details.body,
  //             Time: formattedDate,
  //             userId: userInfo.Id,
  //             cat: details.cat,
  //           },
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to add the task.");
  //       }
  //       const result = await response.json();
  //       dispatch({
  //         type: "CREATE_TODOS_SUCCESS",
  //         payload: result.data,
  //       });
  //       handleClose();
  //       handleShow("Task added successfully");
  //     } catch (error) {
  //       console.error("Error:", error);
  //       dispatch({ type: "CREATE_TODOS_FAILURE", payload: error.message });
  //     }
  //   },
  //   [
  //     t,
  //     i18n.language,
  //     userInfo,
  //     setError,
  //     dispatch,
  //     details,
  //     handleClose,
  //     handleShow,
  //   ]
  // );
  const isRTL = i18n.language === "ar";

  const style = {
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

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        TransitionProps={{ onEntered: handleOnEntered }}
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
                  color="info"
                  id="todoTitle"
                  label={t("Todo Title")}
                  name="title"
                  onChange={(e) =>
                    setDetails({ ...details, title: e.target.value })
                  }
                  sx={style}
                  autoComplete="todoTitle"
                  multiline
                  minRows={1}
                  maxRows={5}
                  helperText={error ? error : ""}
                  error={!!error}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      PasswordRef.current.focus();
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
                  inputRef={PasswordRef}
                  color="info"
                  id="todoDetails"
                  label={t("Todo Details")}
                  name="body"
                  onChange={(e) =>
                    setDetails({ ...details, body: e.target.value })
                  }
                  sx={style}
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
              <Grid size={12}>
                <FormControl fullWidth color="info">
                  <InputLabel>{t("Choose a category")}</InputLabel>
                  <Select
                    value={details.cat}
                    label="Choose a category"
                    onChange={(e) => handleChange(e)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.name} value={category.name}>
                        {t(category.name)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
