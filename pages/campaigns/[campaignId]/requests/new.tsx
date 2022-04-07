import * as React from "react";

import {
  Container,
  Typography,
  Box,
  Stack,
  Grid,
  Button,
  Link,
  TextField,
  InputAdornment,
} from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import LinkButton from "../../../../components/Utils/LinkButton";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import campaignFactory from "../../../../ethereum/factory";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface IFormInputs {
  description: string;
  value: number;
  recipient: string;
}

const schema = yup.object().shape({
  description: yup.string().min(2).required(),
  value: yup.number().positive().required(),
  recipient: yup.string().min(10).required(),
});

function NewRequest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { campaignId } = router.query;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (
    data: IFormInputs,
    event
  ) => {
    event?.preventDefault();
    const response = await toast.promise(
      campaignFactory.createCampaignRequest({ campaignId, ...data }),
      {
        pending: {
          render() {
            setLoading(true);
            return "We are creating your Request. Please wait...";
          },
          icon: true,
        },
        success: {
          render({ data }) {
            router.push(`/campaigns/${campaignId}/requests`);
            return `Request created successfully`;
          },
          icon: true,
        },
        error: {
          render({ data }) {
            return (data as Error).message;
          },
          icon: true,
        },
      }
    );
    console.log("response", response);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        bgColor: "background.paper",
        pt: 8,
        pb: 6,
      }}
    >
      <Container>
        <Typography
          component="h2"
          variant="h3"
          align="left"
          color="text.primary"
          gutterBottom
        >
          New Request
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack component={Grid} maxWidth="sm" spacing={4}>
            <Controller
              name="description"
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  variant="standard"
                  type="text"
                  error={!!errors.description}
                  helperText={
                    errors.description ? errors.description.message : ""
                  }
                />
              )}
            />
            <Controller
              name="value"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Value"
                  variant="standard"
                  type="number"
                  error={!!errors.value}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">ether</InputAdornment>
                    ),
                  }}
                  helperText={errors.value ? errors.value.message : ""}
                />
              )}
            />
            <Controller
              name="recipient"
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Recipient address"
                  variant="standard"
                  type="text"
                  error={!!errors.recipient}
                  helperText={errors.recipient ? errors.recipient.message : ""}
                />
              )}
            />
            <LoadingButton
              type="submit"
              color="primary"
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              Create
            </LoadingButton>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}

export default NewRequest;
