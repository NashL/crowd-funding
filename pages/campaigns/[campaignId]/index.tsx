import * as React from "react";

import {
  Container,
  Typography,
  Box,
  Stack,
  Grid,
  Button,
  Link,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import CampaignFactory from "../../../ethereum/factory";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import CampaignParser from "../../../utils/CampaignParser";
import CampaignCardList from "../../../components/CampaignCardList";
import ContributeForm from "../../../components/ContributeForm";
import { useState } from "react";
import LinkButton from "../../../components/Utils/LinkButton";

function ShowCampaign({
  campaignSummary,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [campaignData, setCampaignData] = useState(campaignSummary);

  async function contributeCampaignReloadHandler() {
    const newCampaignSummary = await CampaignFactory.getCampaignSummary(
      campaignSummary.campaignId
    );
    setCampaignData(newCampaignSummary);
  }
  return (
    <Box
      sx={{
        bgColor: "background.paper",
        pt: 8,
        pb: 3,
      }}
    >
      <Container sx={{ pb: 0 }} maxWidth="lg">
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyItems="center"
          spacing={1}
          sx={{ pb: 4 }}
        >
          <Typography variant="h4">Campaign Show</Typography>
          <Typography variant="subtitle1">{campaignData.campaignId}</Typography>
        </Stack>
        <Stack direction="column">
          <Grid container spacing={0} columns={16}>
            <Grid container item xs={10}>
              <CampaignCardList
                nested={true}
                campaigns={CampaignParser.parseSummaryToCardObjects(
                  campaignData
                )}
              />
              <Box sx={{ mt: 3 }}>
                <LinkButton
                  path={`/campaigns/${campaignData.campaignId}/requests`}
                  text="View Requests"
                  query={{ approvers: campaignData.approversCount }}
                />
              </Box>
            </Grid>
            <Grid
              container
              item
              xs={1}
              justifyContent="center"
              alignItems="center"
            >
              <Divider orientation="vertical" flexItem />
            </Grid>
            <Grid item xs={5}>
              <ContributeForm
                address={campaignData.campaignId}
                contributeCampaignReloadHandler={
                  contributeCampaignReloadHandler
                }
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campaignId } = context.query;
  const campaignSummary = await CampaignFactory.getCampaignSummary(campaignId);

  return {
    props: { campaignSummary: { campaignId: campaignId, ...campaignSummary } },
  };
};

export default ShowCampaign;
