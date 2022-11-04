import React, { useEffect, useState } from "react";
import PropTypes, { number } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import tableTitleImg from "../asset/table_header.png";
import { data } from "../data";
import { PremierLeague } from "../config/teams";
import getTime from "date-fns/getTime";
import { GameStatus } from "../config/const";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row(props) {
  const { order, data } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {order + 1}
        </TableCell>
        <TableCell align="right">{data.team}</TableCell>
        <TableCell align="right">{data.won}</TableCell>
        <TableCell align="right">{data.lost}</TableCell>
        <TableCell align="right">{data.drawn}</TableCell>
        <TableCell align="right">{data.gf}</TableCell>
        <TableCell align="right">{data.ga}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <>hihi</>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  data: PropTypes.shape({
    team: PropTypes.string.isRequired,
    won: PropTypes.number.isRequired,
    drawn: PropTypes.number.isRequired,
    lost: PropTypes.number.isRequired,
    gf: PropTypes.number.isRequired,
    ga: PropTypes.number.isRequired,
    form: PropTypes.arrayOf(
      PropTypes.shape({
        res: PropTypes.string.isRequired,
        time: PropTypes.number.isRequired,
      })
    ).isRequired,
    schedule: PropTypes.arrayOf(
      PropTypes.shape({
        team: PropTypes.string.isRequired,
        time: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  order: PropTypes.number.isRequired,
};

export default function FootballScoreTable() {
  const nowTime = "2021-05-05T14:00:00";
  const [newData, setNewData] = useState();

  const init = () => {
    let newAnalysisData = [];
    let teamComplexArray = [];
    data.map((item) => {
      const scoreData = Object.entries(item.score);
      teamComplexArray.push(scoreData[0][0], scoreData[1][0]);
    });

    const teamSortedArray = [...new Set(teamComplexArray)];

    teamSortedArray.map((team) => {
      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let gf = 0;
      let ga = 0;
      let form = [];
      let next = [];

      data.map((item) => {
        const scoreData_ = Object.entries(item.score);
        if (scoreData_[0][0] === team) {
          if (getTime(new Date(item.date)) < getTime(new Date(nowTime))) {
            played++;
            gf += scoreData_[0][1];
            ga += scoreData_[1][1];
            if (scoreData_[0][1] > scoreData_[1][1]) {
              won++;
              form.push({
                res: GameStatus.win,
                time: getTime(new Date(item.date)),
              });
            } else if (scoreData_[0][1] < scoreData_[1][1]) {
              lost++;
              form.push({
                res: GameStatus.lost,
                time: getTime(new Date(item.date)),
              });
            } else {
              drawn++;
              form.push({
                res: GameStatus.drawn,
                time: getTime(new Date(item.date)),
              });
            }
          } else {
            next.push({
              team: scoreData_[1][0],
              time: getTime(new Date(item.date)),
            });
          }
        } else if (scoreData_[1][0] === team) {
          if (getTime(new Date(item.date)) < getTime(new Date(nowTime))) {
            played++;
            gf += scoreData_[1][1];
            ga += scoreData_[0][1];
            if (scoreData_[0][1] > scoreData_[1][1]) {
              form.push({
                res: GameStatus.lost,
                time: getTime(new Date(item.date)),
              });
              lost++;
            } else if (scoreData_[0][1] < scoreData_[1][1]) {
              form.push({
                res: GameStatus.win,
                time: getTime(new Date(item.date)),
              });
              won++;
            } else {
              form.push({
                res: GameStatus.drawn,
                time: getTime(new Date(item.date)),
              });
              drawn++;
            }
          } else {
            next.push({
              team: scoreData_[0][0],
              time: getTime(new Date(item.date)),
            });
          }
        }
      });

      newAnalysisData.push({
        team: team,
        won: won,
        drawn: drawn,
        lost: lost,
        gf: gf,
        ga: ga,
        form: form,
        schedule: next,
      });
    });

    setNewData(newAnalysisData);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="table-root">
      <img src={tableTitleImg} className="table-title" alt="table header" />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Position</TableCell>
              <TableCell align="right">Won</TableCell>
              <TableCell align="right">Drawn</TableCell>
              <TableCell align="right">Lost</TableCell>
              <TableCell align="right">GF</TableCell>
              <TableCell align="right">GA</TableCell>
              <TableCell align="right">GD</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell align="right">Form</TableCell>
              <TableCell align="right">Next</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newData?.map((row, index) => {
              return <Row key={row.team} data={row} order={index} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
