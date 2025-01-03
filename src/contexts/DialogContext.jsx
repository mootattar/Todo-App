import { createContext, useState } from "react";
import EditDialog from "../components/Dialogs/EditDialog";
import DeleteDialog from "../components/Dialogs/DeleteDialog";
import AdDialog from "../components/Dialogs/AdDialog";
import PropTypes from "prop-types";

export const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleDeleteOpen = (todo) => {
    setTodoToDelete(todo);
    setDeleteDialogOpen((prev) => !prev);
  };
  const handleAdd = () => {
    setAddDialogOpen(!addDialogOpen);
  };
  const handleEditOpen = (todo) => {
    setTodoToEdit(todo);
    setIsEditDialogOpen((prev) => !prev);
  };
  return (
    <DialogContext.Provider
      value={{ handleEditOpen, handleDeleteOpen, handleAdd }}
    >
      <AdDialog close={handleAdd} open={addDialogOpen} />
      {todoToEdit && (
        <EditDialog
          open={isEditDialogOpen}
          close={handleEditOpen}
          todo={todoToEdit}
        />
      )}
      {todoToDelete && (
        <DeleteDialog
          open={deleteDialogOpen}
          close={handleDeleteOpen}
          todo={todoToDelete}
        />
      )}
      {children}
    </DialogContext.Provider>
  );
};

DialogProvider.propTypes = {
  children: PropTypes.node,
};
