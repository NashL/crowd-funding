import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { Link as MUILink } from "@mui/material";
import NextLink from "next/link";

export default function Navbar() {
  return (
    <AppBar position="relative">
      <Toolbar>
        <NextLink href="/" passHref>
          <Stack component={MUILink} direction="row" alignItems="center">
            <GroupsIcon sx={{ mr: 2, color: "primary.contrastText" }} />
            <Typography variant="h6" color="primary.contrastText" noWrap>
              Crow Funding
            </Typography>
          </Stack>
        </NextLink>
      </Toolbar>
    </AppBar>
  );
}
