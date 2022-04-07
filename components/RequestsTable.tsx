import * as React from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import {
  Box,
  Table,
  TableBody,
  Button,
  TableSortLabel,
  TableRow,
  TableHead,
  TablePagination,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import campaignFactory from "../ethereum/factory";
import { toast } from "react-toastify";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";

interface Data {
  id: string;
  description: string;
  amount: string;
  recipient: string;
  approvalCount: string;
  approve: string;
  finalize: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | boolean },
  b: { [key in Key]: number | string | boolean }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Amount(ether)",
  },
  {
    id: "recipient",
    numeric: true,
    disablePadding: false,
    label: "Recipient Address",
  },
  {
    id: "approvalCount",
    numeric: true,
    disablePadding: false,
    label: "Approvals",
  },
  {
    id: "approve",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "finalize",
    numeric: true,
    disablePadding: false,
    label: "",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function RequestsTable({ rows }: { rows: Data[] }) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("description");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const submitApprovalHandler = async (
    campaignAddress: string,
    requestId: string
  ) => {
    try {
      await toast.promise(
        campaignFactory.approveRequest(campaignAddress, requestId),
        {
          pending: {
            render() {
              setLoading(true);
              return "We are sending your approval for this request. Please wait...";
            },
            icon: true,
          },
          success: {
            render({ data }) {
              setLoading(false);
              return `Request approved successfully`;
            },
            icon: true,
          },
          error: {
            render({ data }) {
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

  const submitFinalizeHandler = async (
    campaignAddress: string,
    requestId: string
  ) => {
    toast.promise(campaignFactory.finalizeRequest(campaignAddress, requestId), {
      pending: {
        render() {
          setLoading(true);
          return "We are trying to set this request as finalized. Please wait...";
        },
        icon: true,
      },
      success: {
        render({ data }) {
          setLoading(false);
          return `Request finalized successfully`;
        },
        icon: true,
      },
      error: {
        render({ data }) {
          console.log("finalized error");
          setLoading(false);
          return (data as Error).message;
        },
        icon: true,
      },
    });
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const rowColor = row.finalize ? "#c9c9c9" : "#000000";
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      sx={{ color: "#625a5a" }}
                    >
                      <TableCell align="left" sx={{ color: rowColor }}>
                        {row.id}
                      </TableCell>
                      <TableCell align="left" sx={{ color: rowColor }}>
                        {row.description}
                      </TableCell>
                      <TableCell sx={{ color: rowColor }} align="right">
                        {row.amount}
                      </TableCell>
                      <TableCell sx={{ color: rowColor }} align="right">
                        {row.recipient}
                      </TableCell>
                      <TableCell sx={{ color: rowColor }} align="right">
                        {row.approvalCount}
                      </TableCell>
                      {row.finalize ? (
                        <TableCell sx={{ color: rowColor }} colSpan={2}>
                          Request Finalized
                        </TableCell>
                      ) : (
                        <>
                          <TableCell align="center">
                            <LoadingButton
                              color="info"
                              loading={loading}
                              variant="outlined"
                              onClick={() =>
                                submitApprovalHandler(campaignId, row.id)
                              }
                            >
                              Approve
                            </LoadingButton>
                          </TableCell>
                          <TableCell align="center">
                            <LoadingButton
                              color="primary"
                              loading={loading}
                              variant="outlined"
                              onClick={() =>
                                submitFinalizeHandler(campaignId, row.id)
                              }
                            >
                              Finalize
                            </LoadingButton>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
