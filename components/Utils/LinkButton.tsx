import * as React from "react";
import { Button, Grid, Link as MUILink } from "@mui/material";
import NextLink from "next/link";

export default function LinkButton({
  path,
  text,
  variant = "contained",
  size = "medium",
  query = {},
}: any) {
  return (
    <NextLink href={{ pathname: path, query: query }} passHref>
      <Button component={MUILink} variant={variant} size={size}>
        {text}
      </Button>
    </NextLink>
  );
}
