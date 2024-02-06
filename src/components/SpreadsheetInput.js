
import Spreadsheet from "react-spreadsheet";

function SpreadsheetInput({ projections, setProjections }) {
    const columnLabels = ["Player", "Projection"];

    return (
        <div style={{
            maxHeight: '22vh', // Set a maximum height for the div
            overflowY: 'auto',  // Add a vertical scrollbar when content overflows
            border: '1px solid #ccc', // Optional: Add border for visibility
            fontSize: '2vh' // Optional: Adjust font size for visibility
        }}>
            <Spreadsheet data={projections} onChange={setProjections} columnLabels={columnLabels} />
        </div>
    )
}

export { SpreadsheetInput }
