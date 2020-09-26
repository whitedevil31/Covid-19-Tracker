import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
function InfoBox({ title, cases, isRed, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "info--selected"} ${
        isRed && "info--red"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary">{title}</Typography>
        <h2 className={`infoBox__cases ${!isRed && "info-green"}`}>{cases}</h2>
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
