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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import API from "../api/axios";

export default function Manager() {
  const [tasks, setTasks] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [targetDate, setTargetDate] = useState("");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    API.get("/tasks/all")
      .then((res) =>
        setTasks(res.data.filter((t) => t.assignedBy?.role === "Manager"))
      )
      .catch((err) => console.error(err));

    API.get("/users")
      .then((res) =>
        setTeamLeads(res.data.filter((u) => u.role === "TeamLead"))
      )
      .catch((err) => console.error(err));
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTitle("");
    setDescription("");
    setAssignee("");
    setPriority("Medium");
    setTargetDate("");
  };

  const handleSubmit = async () => {
    try {
      await API.post("/tasks/create", {
        title,
        description,
        assignee,
        priority,
        targetDeliveryDate: targetDate,
      });
      alert("Task created successfully");
      handleCloseDialog();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating task");
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
        Manager Dashboard
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={handleOpenDialog}
      >
        + Add Task
      </Button>

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Assign To (Team Lead)"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            sx={{ mb: 2 }}
          >
            {teamLeads.map((tl) => (
              <MenuItem key={tl._id} value={tl._id}>
                {tl.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            sx={{ mb: 2 }}
          >
            {["High", "Medium", "Low"].map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="date"
            label="Target Delivery Date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
