import { Container, Typography } from "@mui/material";
import Manager from "./Manager";
import TeamLead from "./TeamLead";
import Developer from "./Developer";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container sx={{ mt: 3 }}>
      {user.role === "Manager" && <Manager />}
      {user.role === "TeamLead" && <TeamLead />}
      {user.role === "Developer" && <Developer />}
    </Container>
  );
}
