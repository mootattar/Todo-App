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

import { useSendData } from "../../hooks/useSendData";

import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../contexts/UserContext";
import { useTranslation } from "react-i18next";
import { useToast } from "../../hooks/useToast";
import { useStore } from "../../hooks/useStore";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function AdDialog({ open, close }) {
  const { t, i18n } = useTranslation();
  const { userInfo } = useContext(UserContext);
  const { dispatch } = useStore();
  const [error, setError] = useState(null);
  const { handleShow } = useToast();
  const { addTodoToAPI } = useSendData();
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
  const addTodo = (e) => {
    e.preventDefault();
    addTodoToAPI(
      details,
      setError,
      t,
      userInfo,
      dispatch,
      handleClose,
      handleShow
    );
  };
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
        <form noValidate onSubmit={(e) => addTodo(e)} ref={formRef}>
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
  open: PropTypes.bool,
  close: PropTypes.func,
};
