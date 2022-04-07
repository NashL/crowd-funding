import * as React from "react";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import campaignFactory from "../../ethereum/factory";
import { useRouter } from "next/router";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Container,
  InputAdornment,
  TextField,
  Stack,
  Typography,
  Alert,
  Collapse,
  IconButton,
  Box,
  AlertColor,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// interface IFormInputs {
//   firstName: string;
//   age: number;
// }
//
// const schema = yup
//   .object({
//     firstName: yup.string().required(),
//     age: yup.number().positive().integer().required(),
//   })
//   .required();
//
interface MuiAlert {
  visibility: boolean;
  message: string;
  severity: AlertColor;
}

interface IFormInputs {
  minimumContribution: number;
}

const schema = yup.object().shape({
  minimumContribution: yup.number().positive().moreThan(0).required(),
});

export default function NewCampaign() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    visibility: false,
    message: "",
    severity: "info",
  } as MuiAlert);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<IFormInputs>({
  //   resolver: yupResolver(schema),
  // });
  const onSubmit: SubmitHandler<IFormInputs> = async (
    data: IFormInputs,
    event
  ) => {
    event?.preventDefault();
    setAlertInfo({ ...alertInfo, visibility: false });
    try {
      setLoading(true);
      console.log("form data is", data);
      await campaignFactory.createCampaign(data.minimumContribution);
      setAlertInfo({
        visibility: true,
        message: "new campaign successfully Created",
        severity: "success",
      });
      await router.push("/");
    } catch (error) {
      const errorMessage = (error as Error).message;
      setAlertInfo({
        visibility: true,
        message: errorMessage,
        severity: "error",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Container sx={{ mt: 8 }} maxWidth="lg">
        <Typography variant="h4" align="left" color="subtitle1">
          Create a new campaign
        </Typography>
        <Box sx={{ width: "auto", mt: 3 }}>
          <Collapse in={alertInfo.visibility}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlertInfo({ ...alertInfo, visibility: false });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity={alertInfo.severity}
              sx={{ mb: 2 }}
            >
              {alertInfo.message}
            </Alert>
          </Collapse>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} direction="row" alignItems="center" sx={{ p: 2 }}>
            <Controller
              name="minimumContribution"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="MinimumContribution"
                  variant="standard"
                  type="number"
                  error={!!errors.minimumContribution}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">wei</InputAdornment>
                    ),
                  }}
                  helperText={
                    errors.minimumContribution
                      ? errors.minimumContribution.message
                      : ""
                  }
                />
              )}
            />
            {/*{errors.minimumContribution &&*/}
            {/*  errors.minimumContribution?.message && (*/}
            {/*    <span>errors.minimumContribution.message</span>*/}
            {/*  )}*/}
            <LoadingButton
              sx={{ ml: "10px" }}
              type="submit"
              color="primary"
              // onClick={handleClick}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              Send
            </LoadingButton>
            {/*<input type="submit" />*/}
          </Stack>
        </form>
      </Container>
    </>
  );
}
