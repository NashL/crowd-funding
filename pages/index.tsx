import * as React from "react";
import { Box, Button, Container, Typography, Stack } from "@mui/material";
import Router from "next/router";
import { InferGetServerSidePropsType } from "next";
import CampaignFactory from "../ethereum/factory";
import CampaignCardList from "../components/CampaignCardList";
import CampaignParser from "../utils/CampaignParser";
import LinkButton from "../components/Utils/LinkButton";

function Home({
  campaigns,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parsedCampaigns = CampaignParser.parseCardListItems(campaigns);
  console.log("parsedCampaigns", parsedCampaigns);
  return (
    <>
      <Box
        sx={{
          bgColor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Crowd Funding
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            paragraph
          >
            CrowdFunDing is a platform for gathering money from the public, which
            circumvents traditional avenues of investment. Project creators
            choose a deadline and a minimum funding goal. If the goal is not met
            by the deadline, no funds are collected (a kind of assurance
            contract)
          </Typography>
        </Container>
      </Box>

      <Container sx={{ pb: 0 }} maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Typography
            variant="h4"
            align="left"
            color="text.primary"
            gutterBottom
          >
            Open Campaigns
          </Typography>
          <LinkButton path="/campaigns/new" text="New Campaign" size="large" />
        </Stack>
        <CampaignCardList campaigns={parsedCampaigns} sx={{ mt: 5 }} />
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const campaigns = await CampaignFactory.getDeployedCampaigns();
  return { props: { campaigns } };
}

export default Home;
