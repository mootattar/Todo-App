import PropTypes from "prop-types";

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
import React, { useCallback, useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid2";

const mainUrl = import.meta.env.VITE_MAIN_URL;
import { forwardRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";
import { useStore } from "../../contexts/ReducerContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditDialog({ title, body, cat, open, close, id, ischecked }) {
  const { handleShow } = useToast();
  const [error, setError] = useState("");
  const [details, setDetails] = useState({
    title: "",
    body: "",
    category: "",
  });
  const { dispatch } = useStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
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
      category: e.target.value,
    });
  };

  const handleOnEntered = () => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  };

  const handleClose = useCallback(() => {
    close();
    setError(null);
  }, [close]);

  const editTodo = useCallback(
    async (e) => {
      e.preventDefault();
      if (details.title.trim().length < 1 && details.body.trim().length < 1) {
        setError(t("you Cannot make the task empty"));
        return;
      }
      try {
        const response = await fetch(`${mainUrl}/api/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              Title: details.title,
              body: details.body,
              cat: details.category,
            },
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add the task.");
        }
        dispatch({
          type: "updateTodo",
          payload: {
            id: id,
            Title: details.title,
            body: details.body,
            cat: details.category,
            ischecked: ischecked,
          },
        });
        handleClose();
        handleShow("Task updated successfully");
      } catch (error) {
        console.error("Error:", error);
        dispatch({ type: "UpdateTodosFailure", payload: error.message });
      }
    },
    [handleClose, t, setError, dispatch, id, ischecked, details, handleShow]
  );

  useEffect(() => {
    setDetails({ title, body, category: cat });
  }, [title, body, cat]);

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        TransitionProps={{ onEntered: handleOnEntered }}
      >
        <form noValidate onSubmit={editTodo} ref={formRef}>
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
                {t("Edit Todo")}
              </Typography>
              <Button autoFocus color="inherit" type="submit">
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
                  variant="outlined"
                  fullWidth
                  color="secondary"
                  inputRef={titleRef}
                  id="todoTitle"
                  label={t("Todo Title")}
                  name="title"
                  multiline
                  minRows={1}
                  maxRows={3}
                  onChange={(e) =>
                    setDetails({ ...details, title: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (formRef.current) {
                        formRef.current.requestSubmit();
                      }
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
                  autoComplete="todoTitle"
                  value={details.title}
                  helperText={error ? error : ""}
                  error={!!error}
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
                  multiline
                  color="secondary"
                  minRows={1}
                  maxRows={3}
                  id="todoDetails"
                  label={t("Todo Details")}
                  name="body"
                  onChange={(e) =>
                    setDetails({ ...details, body: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (formRef.current) {
                        formRef.current.requestSubmit();
                      }
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
                  autoComplete={t("Todo Details")}
                  value={details.body}
                  helperText={error ? error : ""}
                  error={!!error}
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
                    value={details.category}
                    label={t("Choose a category")}
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

export default React.memo(EditDialog);

EditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  cat: PropTypes.string.isRequired,
  id: PropTypes.number,
  ischecked: PropTypes.bool.isRequired,
};
