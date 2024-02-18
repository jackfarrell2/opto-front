
import Spreadsheet from "react-spreadsheet";
import { useMediaQuery } from "@mui/material";

function SpreadsheetInput({ projections, setProjections }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const columnLabels = ["Player", "Projection"];

    return (
        <div style={{
            maxHeight: '22vh', // Set a maximum height for the div
            overflowY: 'auto',  // Add a vertical scrollbar when content overflows
            overflowX: 'auto',  // Add a horizontal scrollbar when content overflows
            border: '1px solid #ccc', // Optional: Add border for visibility
            fontSize: '2vh', // Optional: Adjust font size for visibility
            width: isMobile ? '25vh' : null
        }}>
            <Spreadsheet data={projections} onChange={setProjections} columnLabels={columnLabels} />
        </div>
    )
}

export { SpreadsheetInput }
