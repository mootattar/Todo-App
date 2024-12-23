import {
  Typography,
  Button,
  AppBar,
  Slide,
  Toolbar,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid2";

import { forwardRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useToast } from "../../contexts/ToastContext";
import { useStore } from "../../contexts/ReducerContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../fireBaseConfig";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteDialog({ open, close, title, body, cat, id }) {
  const { handleShow } = useToast();
  const { dispatch } = useStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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

  const deleteOne = useCallback(async () => {
    dispatch({
      type: "deleteTodo",
      payload: { id: id },
    });
    close();
    handleShow("Task deleted successfully");
    try {
      const todosCollection = collection(db, "todos");
      const q = query(todosCollection, where("id", "==", id));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const todoDoc = querySnapshot.docs[0];
        const todoRef = doc(db, "todos", todoDoc.id);
        await deleteDoc(todoRef);
        console.log("Document deleted successfully");
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch({ type: "Delete_TODOS_FAILURE", payload: error.message });
    }
  }, [dispatch, id, close, handleShow]);

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={close}
        TransitionComponent={Transition}
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
                sx={style}
                autoComplete="todoTitle"
                multiline
                minRows={1}
                maxRows={5}
                value={title}
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
                sx={style}
                autoComplete={t("Todo Details")}
                multiline
                minRows={1}
                maxRows={5}
                value={body}
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
                sx={style}
                autoComplete={t("Todo Details")}
                multiline
                minRows={1}
                maxRows={5}
                value={cat}
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
  open: PropTypes.bool,
  close: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string,
  cat: PropTypes.string,
  id: PropTypes.any,
};