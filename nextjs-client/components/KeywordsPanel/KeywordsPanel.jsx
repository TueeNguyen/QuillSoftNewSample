import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataContext from "../context/DataContext";

export default function KeywordsPanel(props) {
  const { keywordsToPanel } = props;
  console.log(keywordsToPanel);
  const fakeKeyword = ["keyword1", "keyword2", "keyword3"];
  return (
    <div>
      {keywordsToPanel.length > 0 &&
        keywordsToPanel.map((result, idx) => {
          return (
            <div key={`${result[0]}+${idx}`}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>{result[0]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
    </div>
  );
}
