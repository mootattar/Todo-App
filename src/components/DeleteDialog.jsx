import {
  Typography,
  Button,
  AppBar,
  Slide,
  Toolbar,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useCallback, useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid2";

import { forwardRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Contax } from "../contexts/Contax";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteDialog({ open, close, title, body, id }) {
  const { dispatch } = useContext(Contax);
  const [details, setDetails] = useState({ title: "", body: "" });
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const deleteOne = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add the task.");
      }
      dispatch({
        type: "deleteTodo",
        payload: { id: id },
      });
      setDetails({
        title: "",
        body: "",
      });
      close();
    } catch (error) {
      console.error("Error:", error);
      dispatch({ type: "Delete_TODOS_FAILURE", payload: error.message });
    }
  }, [dispatch, id, close]);

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={close}
        TransitionComponent={Transition}
        sx={{ zIndex: 10002 }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={close}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ flex: 1, marginLeft: "16px" }}
              color={"inherit"}
            >
              {t("Delete Todo")}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              sx={{
                display: "block",
                color: "white",
                textAlign: "center",
              }}
              onClick={deleteOne}
            >
              {t("Yes")}
            </Button>
            <Button
              autoFocus
              color="inherit"
              sx={{
                display: "block",
                color: "white",
                textAlign: "center",
              }}
              onClick={close}
            >
              {t("No")}
            </Button>
          </Toolbar>
        </AppBar>
        <form
          noValidate
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
                id="todoTitle"
                label={t("Todo Title")}
                name="title"
                onChange={(e) =>
                  setDetails({ ...details, title: e.target.value })
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
                autoComplete="todoTitle"
                multiline
                minRows={1}
                maxRows={5}
                defaultValue={title}
                slotProps={{
                  formHelperText: {
                    style: {
                      textAlign: isRTL ? "right" : "left",
                    },
                  },
                  input: {
                    readOnly: true,
                    disabled: true,
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
                defaultValue={body}
                slotProps={{
                  formHelperText: {
                    style: {
                      textAlign: isRTL ? "right" : "left",
                    },
                  },
                  input: {
                    readOnly: true,
                    disabled: true,
                    dir: isRTL ? "rtl" : "ltr",
                  },
                }}
              />
            </Grid>
          </Grid>
        </form>
      </Dialog>
    </>
  );
}

export default React.memo(DeleteDialog);

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  id: PropTypes.number,
};
