import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

const TodoCard = React.memo(
  ({ todo, handleCheck, handleEditOpen, handleDeleteOpen, color }) => {
    TodoCard.displayName = "TodoCard";
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    const EditRef = useRef(null);
    const handleEdit = () => {
      handleEditOpen(todo);
      EditRef.current.blur();
    };

    return (
      <div
        style={{
          width: "21vw",
          minWidth: 235,
          marginTop: 8,
        }}
      >
        <Card
          sx={{
            maxWidth: "100%",
            borderTop: `5px solid ${color}`,
          }}
          variant="elevation"
        >
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              className={`line-through ${
                todo.attributes.ischecked ? "checked" : ""
              } ${isRTL ? "rtl" : "ltr"} animate delay1 `}
              color={todo.attributes.ischecked ? "info" : `${color}`}
            >
              {todo.attributes.Title}
            </Typography>
            <Typography
              className="animate delay2"
              variant="body2"
              component="p"
            >
              {todo.attributes.body}
            </Typography>
            <Typography className="animate delay3" color="textSecondary">
              {todo.attributes.Time}
            </Typography>
          </CardContent>
          <CardActions>
            <Tooltip arrow title={t("check")}>
              <Checkbox
                className="animate delay4"
                size="small"
                checked={todo.attributes.ischecked}
                onClick={() => handleCheck(todo.attributes.ischecked, todo.id)}
                color="info"
                sx={{
                  color: "#29b6f6",
                }}
              />
            </Tooltip>

            <Tooltip arrow title={t("Edit")}>
              <IconButton
                className="animate delay5"
                onClick={handleEdit}
                ref={EditRef}
              >
                <EditIcon color="secondary" fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title={t("Delete")}>
              <IconButton
                className="animate delay6"
                onClick={() => handleDeleteOpen(todo)}
              >
                <DeleteIcon color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </div>
    );
  }
);

export default TodoCard;

TodoCard.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    attributes: PropTypes.shape({
      ischecked: PropTypes.bool.isRequired,
      Title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      Time: PropTypes.string.isRequired,
      userId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  handleCheck: PropTypes.func.isRequired,
  handleEditOpen: PropTypes.func.isRequired,
  handleDeleteOpen: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
};
