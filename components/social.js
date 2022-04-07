import { social_media } from "../data/social_media";
import { Grid } from "@mui/material";

// import LinkedinIcon from "@mui/icons-material/Linkedin";

import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";

const Social = ({ color }) => {
  const { linkedin, github, homepage } = social_media;

  return (
    <Grid item container spacing={2} justify="center">
      <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href={homepage}
      >
        <HomeIcon sx={{ width: "30px", height: "30px", color: "#ffe" }} />
      </Grid>
      {/*<Grid*/}
      {/*  item*/}
      {/*  component={"a"}*/}
      {/*  target="_blank"*/}
      {/*  rel="noreferrer noopener"*/}
      {/*  href={facebook}*/}
      {/*>*/}
      {/*  <StackOverFlow sx={{ width: "30px", height: "30px", color: "#ffe" }} />*/}
      {/*</Grid>*/}
      <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href={github}
      >
        <GitHubIcon
          color="white"
          sx={{ width: "30px", height: "30px", color: "#ffe" }}
        />
      </Grid>
      {/* <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href={linkedin}
      >
        <LinkedinIcon
          color="white"
          sx={{ width: "30px", height: "30px", color: "#ffe" }}
        />
      </Grid> */}
    </Grid>
  );
};

export default Social;
