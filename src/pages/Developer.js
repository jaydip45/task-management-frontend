import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, TextField, Button } from "@mui/material";
import API from "../api/axios";

export default function Developer() {
  const [tasks, setTasks] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  useEffect(() => {
    API.get("/api/tasks/all").then(res => setTasks(res.data.filter(t => t.assignee?.role === "developer"))).catch(err => console.error(err));
  }, []);

  const handleAddComment = async () => {
    try {
      await API.post("/api/tasks/comment", { taskId: selectedTask, message: comment });
      alert("Comment added");
      setComment(""); setSelectedTask("");
    } catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  return (
    <Container>
      <Typography variant="h6" mb={2}>Developer Dashboard</Typography>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Target Delivery</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(t => (
              <TableRow key={t._id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>{t.priority}</TableCell>
                <TableCell>{new Date(t.targetDeliveryDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TextField select fullWidth label="Select Task" value={selectedTask} onChange={e => setSelectedTask(e.target.value)} sx={{ mt: 2 }}>
          {tasks.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
        </TextField>
        <TextField fullWidth multiline rows={3} label="Progress Comment" value={comment} onChange={e => setComment(e.target.value)} sx={{ mt: 2, mb: 2 }} />
        <Button variant="contained" onClick={handleAddComment}>Add Comment</Button>
      </Paper>
    </Container>
  );
}
