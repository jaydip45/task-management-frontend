import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import API from "../api/axios";

export default function Developer() {
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    API.get("/tasks/all")
      .then((res) =>
        setTasks(res.data.filter((t) => t.assignee?.role === "Developer"))
      )
      .catch((err) => console.error(err));
  }, []);

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setComment("");
  };

  const handleAddComment = async () => {
    try {
      await API.post("/tasks/comment", {
        taskId: selectedTask._id,
        message: comment,
      });
      alert("Comment added");
      setComment("");
      setOpenDialog(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };


  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Developer Dashboard
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>SrNo</strong></TableCell>
              <TableCell><strong>Assigned By</strong></TableCell>
              <TableCell><strong>Assignee</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Details</strong></TableCell>
              <TableCell><strong>Assigned Date</strong></TableCell>
              <TableCell><strong>Target Date</strong></TableCell>
              <TableCell><strong>Actual Date</strong></TableCell>
              <TableCell><strong>Time Taken</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Priority</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((t, idx) => (
              <TableRow
                key={t._id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                }}
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{t.assignedBy?.name}</TableCell>
                <TableCell>{t.assignee?.name}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>
                  {new Date(t.assignedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(t.targetDeliveryDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {t.actualDeliveryDate
                    ? new Date(t.actualDeliveryDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>{t.timeTaken || "-"}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "12px",
                      color: "white",
                      backgroundColor:
                        t.priority === "High"
                          ? "#d32f2f"
                          : t.priority === "Medium"
                          ? "#f9a825"
                          : "#388e3c",
                    }}
                  >
                    {t.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, t)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenDialog}>Add Comment</MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Comment for: {selectedTask?.title}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Progress Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button
            onClick={handleAddComment}
            variant="contained"
            disabled={!comment}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
