import { Box, Grid, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Social from "../social";
import CopyrightIcon from "@mui/icons-material/Copyright";
import HomeIcon from "@mui/icons-material/Home";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        width: `100%`,
        position: "relative",
        overflow: "hidden",
        marginTop: "6em",
        padding: "2em 0 ",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" style={{ margin: "1.2em 0" }}>
          <Social />
        </Grid>
        <Grid
          item
          container
          component={"a"}
          target="_blank"
          rel="noreferrer noopener"
          href="https://oscarluza.com"
          justify="center"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography sx={{ color: "#fff" }}>
            <span>&copy; Oscar Luza</span>
          </Typography>
        </Grid>
      </Container>
    </Box>
  );
}
