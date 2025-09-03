import { Container, Typography } from "@mui/material";
import Manager from "./Manager";
import TeamLead from "./TeamLead";
import Developer from "./Developer";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" mb={2}>Dashboard</Typography>
      {user.role === "manager" && <Manager />}
      {user.role === "teamlead" && <TeamLead />}
      {user.role === "developer" && <Developer />}
    </Container>
  );
}
