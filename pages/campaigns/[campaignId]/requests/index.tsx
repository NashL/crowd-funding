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
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import LinkButton from "../../../../components/Utils/LinkButton";
import { useRouter } from "next/router";
import campaignFactory from "../../../../ethereum/factory";
import RequestsTable from "../../../../components/RequestsTable";
import campaignParser from "../../../../utils/CampaignParser";

function ShowCampaign({
  requests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { campaignId } = router.query;
  return (
    <>
      <Box
        sx={{
          bgColor: "background.paper",
          pt: 8,
        }}
      >
        <Container>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              component="h1"
              variant="h2"
              align="left"
              color="text.primary"
              gutterBottom
            >
              Requests
            </Typography>
            <LinkButton
              path={`/campaigns/${campaignId}/requests/new`}
              text="New Request"
            />
          </Stack>
          <RequestsTable rows={requests} />
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campaignId, approvers } = context.query;
  const requests = await campaignFactory.getAllRequests(campaignId);
  const parsedRequests = campaignParser.parseRequests(requests, approvers);
  return {
    props: { requests: parsedRequests },
  };
};

export default ShowCampaign;
