import React from "react";
import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";
import Box from "@mui/material/Box";
import { ShowPacksCards } from "./ShowPacksCards";
import { NumberOfCards } from "./NumberOfCards";
import { AddNewPack } from "./AddNewPack";
import { InputSearch } from "../../components/InputSearch";
import { TableCards } from "./TableCards";
import { TablePaginationComponent } from "../../components/TablePaginationComponent";

export const PacksList = () => {
  const [orderBy, setOrderBy] = React.useState("calories");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
        width: "100%",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "1000px",
          height: "600px",
        }}
      >
        <AddNewPack />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <InputSearch />
          <ShowPacksCards />
          <NumberOfCards />
          <Box
            sx={{
              alignSelf: "self-end",
              marginBottom: "2px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "36px",
                height: "36px",
                background: "#FFFFFF",
                border: "1px solid #D9D9D9",
                borderRadius: "2px",
              }}
            >
              <FilterAltSharpIcon />
            </Box>
          </Box>
        </Box>
        <TableCards />
        <TablePaginationComponent />
      </Box>
    </Box>
  );
};