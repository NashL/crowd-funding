import * as React from "react";
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import campaignFactory from "../ethereum/factory";
import { Dispatch, SetStateAction } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
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
import { toast } from "react-toastify";

interface Campaign {
  address: string;
  contributeCampaignReloadHandler: any;
}

interface MuiAlert {
  visibility: boolean;
  message: string;
  severity: AlertColor;
}

interface IFormInputs {
  amountToContribute: number;
}

const schema = yup.object().shape({
  amountToContribute: yup.number().positive().required(),
});

export default function ContributeForm({
  address,
  contributeCampaignReloadHandler,
}: Campaign) {
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    visibility: false,
    message: "",
    severity: "info",
  } as MuiAlert);

  const {
    handleSubmit,
    control,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  const onSubmit: SubmitHandler<IFormInputs> = async (
    data: IFormInputs,
    event
  ) => {
    event?.preventDefault();

    try {
      await toast.promise(
        campaignFactory.contributeCampaign(address, data.amountToContribute),
        {
          pending: {
            render() {
              setLoading(true);
              return "We are sending your contribution. Please wait...";
            },
            icon: true,
          },
          success: {
            render({ data }) {
              setLoading(false);
              return "Contribute successfully received";
            },
            icon: true,
          },
          error: {
            render({ data }) {
              console.log("approval error");
              setLoading(false);
              return (data as Error).message;
            },
            icon: true,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box sx={{ width: "auto" }}>
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
        <Typography variant="h4" align="left" color="subtitle1" sx={{ mb: 1 }}>
          Amount To Contribute
        </Typography>
        <Stack
          spacing={3}
          direction="column"
          alignItems="flex-start"
          // sx={{ p: 2 }}
        >
          <Controller
            name="amountToContribute"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                label="Amount to Contribute"
                variant="standard"
                type="number"
                error={!!errors.amountToContribute}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ether</InputAdornment>
                  ),
                }}
                helperText={
                  errors.amountToContribute
                    ? errors.amountToContribute.message
                    : ""
                }
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
            Contribute!
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
}
