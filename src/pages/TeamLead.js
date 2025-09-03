import { useState, useEffect } from "react";
import { Container, Typography, TextField, MenuItem, Button, Paper, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import API from "../api/axios";

export default function TeamLead() {
  const [tasks, setTasks] = useState([]);
  const [devs, setDevs] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    API.get("/api/tasks/all").then(res => setTasks(res.data.filter(t => t.assignee?.role === "teamlead"))).catch(err => console.error(err));
    API.get("/api/users").then(res => setDevs(res.data.filter(u => u.role === "developer"))).catch(err => console.error(err));
  }, []);

  const handleReassign = async () => {
    try {
      await API.put("/api/tasks/reassign", { taskId: selectedTask, newAssignee });
      alert("Task reassigned successfully");
      setSelectedTask(""); setNewAssignee("");
    } catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  const handleStatusUpdate = async () => {
    try {
      await API.put("/api/tasks/status", { taskId: selectedTask, status });
      alert("Status updated successfully");
      setSelectedTask(""); setStatus("");
    } catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  return (
    <Container>
      <Typography variant="h6" mb={2}>Team Lead Dashboard</Typography>
      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField select fullWidth label="Select Task" value={selectedTask} onChange={e => setSelectedTask(e.target.value)} sx={{ mb: 2 }}>
          {tasks.map(t => <MenuItem key={t._id} value={t._id}>{t.title}</MenuItem>)}
        </TextField>

        <TextField select fullWidth label="Reassign To Developer" value={newAssignee} onChange={e => setNewAssignee(e.target.value)} sx={{ mb: 2 }}>
          {devs.map(d => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={handleReassign} sx={{ mr: 2 }}>Reassign</Button>

        <TextField select fullWidth label="Update Status" value={status} onChange={e => setStatus(e.target.value)} sx={{ mb: 2, mt: 2 }}>
          {["In Progress","R&D Phase","Completed"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={handleStatusUpdate}>Update Status</Button>
      </Paper>
    </Container>
  );
}
