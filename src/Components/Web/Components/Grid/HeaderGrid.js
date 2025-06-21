import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import styled from "styled-components";
import PropTypes from "prop-types";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";
import { openPdf } from "./ExportPdf";
import { openExcel } from "./ExportExcel";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  minHeight: "38px !important",
  "& .MuiTabs-indicator": {
    backgroundColor: "#8884D9",
  },

  "& .Mui-selected": {
    color: "rgba(0, 0, 0, 0.85)",
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    fontWeight: 500,
    marginRight: 1,
    color: "#595959",
    minHeight: 0,
    width: "49%",
  })
);

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: "#f5f8fa",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(61, 59, 94,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "rgba(136, 132, 217,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#8884D9",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#8884D9",
  },
});

function BpCheckbox(props) {
  return (
    <Checkbox
      sx={{
        "&:hover": { bgcolor: "transparent" },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      {...props}
    />
  );
}

const Label = styled(Typography)({
  fontSize: "0.65vw",
  fontWeight: "500",
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const HeaderGrid = forwardRef((props, ref) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = React.useState(0);
  const [ascSort, setAscSort] = useState("inactive");
  const [descSort, setDescSort] = useState("inactive");
  const [noSort, setNoSort] = useState("inactive");
  const [term, setTerm] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVisibility = (name, value) => {
    props.columnApi.setColumnVisible(name, !value);
  };

  const onSortRequested = (order, event) => {
    props.column.colDef.sortable && props.progressSort(event.shiftKey);
  };

  const onSortChanged = () => {
    setAscSort(props.column.isSortAscending() ? "active" : "inactive");
    setDescSort(props.column.isSortDescending() ? "active" : "inactive");
    setNoSort(
      !props.column.isSortAscending() && !props.column.isSortDescending()
        ? "active"
        : "inactive"
    );
  };

  useEffect(() => {
    props.column.addEventListener("sortChanged", onSortChanged);
    onSortChanged();
  }, []);

  const onFilterTextBoxChanged = (e) => {
    setTerm(e.target.value);
    props.api.setQuickFilter(e.target.value);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Box
        // component={'div'}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        width={"100%"}
        onClick={(event) => onSortRequested("asc", event)}
        onTouchEnd={(event) => onSortRequested("asc", event)}
      >
        {
          // props.api.getAllDisplayedColumns().indexOf(props.column) == 0 ? (
          //   <>
          //     {/* <IconButton
          //       aria-describedby={id}
          //       sx={{
          //         p: 0,
          //         // position: 'absolute',
          //         // left: 0,
          //       }}
          //       onClick={handleClick}
          //     >
          //       <TuneRoundedIcon />
          //     </IconButton> */}
          //     <h style={{ marginLeft: '10px', fontSize: '5rem' }}>{props.displayName}</h>
          //   </>
          // ) :
          <>
            <h
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                paddingLeft: 0,
                left: 0,
              }}
            >
              {props.displayName}
            </h>
          </>
        }

        {ascSort !== "inactive" && (
          <ArrowUpwardIcon
            sx={{ position: "absolute", right: 0, marginRight: "5px" }}
          />
        )}
        {descSort !== "inactive" && (
          <ArrowDownwardIcon
            sx={{ position: "absolute", right: 0, marginRight: "5px" }}
          />
        )}
      </Box>
      {/* <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ width: '10vw' }}>
            <AntTabs value={value} onChange={handleChange}>
              <AntTab
                icon={<TableChartOutlinedIcon />}
                iconPosition="start"
                label="Colunas"
              />
              <AntTab
                icon={<TableChartOutlinedIcon />}
                iconPosition="start"
                label="Exportar"
              />
            </AntTabs>
            <TabPanel value={value} index={0}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}
              >
                <Box>
                  <Label>Pesquisar no grid:</Label>
                  <TextField
                    size="small"
                    value={term}
                    sx={{ mt: 1 }}
                    onChange={onFilterTextBoxChanged}
                  />
                </Box>
                
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}
              >
                <Button
                  onClick={() => openPdf(ref)}
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                >
                  Exportar Pdf
                </Button>
                <Button
                  onClick={() => openExcel(ref)}
                  variant="outlined"
                  startIcon={<GridOnIcon />}
                >
                  Exportar Excel
                </Button>
              </Box>
            </TabPanel>
          </Box>
        </Popover> */}
    </>
  );
});

export default HeaderGrid;
