import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function KeyConcepts({ words, updateKeyconceptIndex }) {
  const [selectConcept, setSelectConcept] = useState("");
  const handleChange = (e) => {
    setSelectConcept(e.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>KeyConcepts</InputLabel>
        <Select
          value={selectConcept}
          label="KeyConcepts"
          onChange={handleChange}
        >
          {words.map((result, idx) => {
            return (
              <MenuItem
                key={idx}
                value={result}
                onClick={() => {
                  updateKeyconceptIndex(idx);
                }}
              >
                {result}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
