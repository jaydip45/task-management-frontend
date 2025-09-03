import { useState, useEffect } from "react";
import { Container, TextField, Button, MenuItem, Typography } from "@mui/material";
import API from "../api/axios";

export default function Manager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [targetDate, setTargetDate] = useState("");
  const [teamLeads, setTeamLeads] = useState([]);
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    // Fetch all TLs
    API.get("/api/users")
      .then((res) => setTeamLeads(res.data.filter(u => u.role === "teamlead")))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/api/tasks/create", { title, description, assignee, priority, targetDeliveryDate: targetDate });
      alert("Task created successfully");
      setTitle(""); setDescription(""); setAssignee(""); setTargetDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating task");
    }
  };

  return (
    <Container>
      <Typography variant="h6" mb={2}>Create Task</Typography>
      <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Description" value={description} onChange={e => setDescription(e.target.value)} sx={{ mb: 2 }} />
      <TextField select fullWidth label="Assign To (Team Lead)" value={assignee} onChange={e => setAssignee(e.target.value)} sx={{ mb: 2 }}>
        {teamLeads.map(tl => <MenuItem key={tl._id} value={tl._id}>{tl.name}</MenuItem>)}
      </TextField>
      <TextField select fullWidth label="Priority" value={priority} onChange={e => setPriority(e.target.value)} sx={{ mb: 2 }}>
        {["High", "Medium", "Low"].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
      </TextField>
      <TextField fullWidth type="date" label="Target Delivery Date" value={targetDate} onChange={e => setTargetDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
      <Button variant="contained" onClick={handleSubmit}>Create Task</Button>
    </Container>
  );
}
