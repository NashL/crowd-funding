import * as React from "react";
import { Grid } from "@mui/material";
import CampaignCardListItem from "./CampaignCardListItem";

export default function CampaignCardList({ campaigns, nested }: any) {
  const nestedValue = nested ? "item" : "";
  return (
    <Grid
      container
      direction="row"
      spacing={2}
      alignItems="center"
      columns={10}
      // columns={{ xs: 16, sm: 16, md: 16 }}
    >
      {campaigns.map((campaign: any, index: any) => {
        return <CampaignCardListItem key={index} {...campaign} />;
      })}
    </Grid>
  );
}
