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
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import API from "../api/axios";

export default function TeamLead() {
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openReassignDialog, setOpenReassignDialog] = useState(false);
  const [status, setStatus] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [newAssignee, setNewAssignee] = useState("");

  useEffect(() => {
    API.get("/tasks/all")
      .then((res) =>
        setTasks(res.data.filter((t) => t.assignedBy?.role === "TeamLead"))
      )
      .catch((err) => console.error(err));

      API.get("/users")
      .then((res) => {
        const devs = res.data.filter((u) => u.role === "Developer");
        setDevelopers(devs);
      })
      .catch((err) => console.error(err));
    
  }, []);

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenStatusDialog = () => {
    setStatus(selectedTask?.status || "");
    setOpenStatusDialog(true);
    handleMenuClose();
  };
  const handleStatusUpdate = async () => {
    try {
      await API.put("/tasks/status", {
        taskId: selectedTask._id,
        status,
      });
      alert("Status updated");
      setOpenStatusDialog(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  const handleOpenReassignDialog = () => {
    setNewAssignee("");
    setOpenReassignDialog(true);
    handleMenuClose();
  };
  const handleReassign = async () => {
    try {
      await API.put("/tasks/reassign", {
        taskId: selectedTask._id,
        newAssignee,
      });
      alert("Task reassigned");
      setOpenReassignDialog(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error reassigning task");
    }
  };

  const calculateTimeTaken = (assignedDate, actualDeliveryDate) => {
    if (!actualDeliveryDate) return "-";
    const diff =
      new Date(actualDeliveryDate).getTime() -
      new Date(assignedDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} Day${days > 1 ? "s" : ""}`;
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Team Lead Dashboard
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
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
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
                <TableCell>
                  {calculateTimeTaken(t.assignedDate, t.actualDeliveryDate)}
                </TableCell>
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
        <MenuItem onClick={handleOpenStatusDialog}>Update Status</MenuItem>
        <MenuItem onClick={handleOpenReassignDialog}>Reassign</MenuItem>
      </Menu>

      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Status for: {selectedTask?.title}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              native
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReassignDialog} onClose={() => setOpenReassignDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reassign Task: {selectedTask?.title}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Developer</InputLabel>
            <Select
              native
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
            >
              <option value="">-- Select Developer --</option>
              {developers.map((dev) => (
                <option key={dev._id} value={dev._id}>
                  {dev.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReassignDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReassign} disabled={!newAssignee}>
            Reassign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
