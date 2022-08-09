import React from "react";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Highlighted from "../Highlighted/Highlighted ";

export default function KeywrodResult(props) {
  const { keywordsToPanel, resultTopanel, idx } = props;

  return (
    <div>
      {resultTopanel.length > 0 &&
        resultTopanel[idx].map((result, index) => {
          console.log(result);
          return (
            <div key={index}>
              <AccordionDetails>
                <Typography>
                  <Highlighted text={result} highlight={keywordsToPanel[idx]} />
                </Typography>
              </AccordionDetails>
            </div>
          );
        })}
    </div>
  );
}
