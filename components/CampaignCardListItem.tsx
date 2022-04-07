import * as React from "react";
import {
  CardActions,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import LinkButton from "./Utils/LinkButton";

export default function CampaignCardListItem({
  title,
  subtitle,
  description,
  button,
}: any) {
  const buttonSection = !!button ? (
    <CardActions sx={{ p: 0 }}>
      <LinkButton
        path={button.url}
        text={button.text}
        size="small"
        variant="outlined"
      />
    </CardActions>
  ) : (
    ""
  );
  const descriptionSection = description ? (
    <Typography variant="body2">{description}</Typography>
  ) : (
    ""
  );
  return (
    <Grid item xs={5} zeroMinWidth>
      <Card>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            style={{ overflowWrap: "break-word" }}
          >
            {title}
          </Typography>
          <Typography
            sx={{ mb: 1.5 }}
            color="text.secondary"
            variant="subtitle2"
          >
            {subtitle}
          </Typography>
          {descriptionSection}
          {buttonSection}
        </CardContent>
      </Card>
    </Grid>
  );
}
