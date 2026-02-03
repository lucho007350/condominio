import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { login } from "../services/auth";

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    window.location.href = "/";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e8f5e9",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Condominio App
        </Typography>

        <Typography variant="body2" textAlign="center" mb={3}>
          Ingreso al sistema
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField label="Usuario" fullWidth required margin="normal" />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            required
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Ingresar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
