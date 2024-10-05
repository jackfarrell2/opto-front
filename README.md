# DraftKings Lineup Optimizer

## Overview
Welcome to the DraftKings Lineup Optimizer! This application enables users to create optimal lineups for DraftKings contests. You can utilize the default projections or upload your own. The optimizer calculates the highest-scoring lineups by utilizing linear programming techniques while adhering to all contest constraints and your custom settings.

This is the frontend. If you are looking for the backend please navigate to the "opto-back" project: [GitHub Repository](https://github.com/jackfarrell2/opto-back).

Check out the deployed project at [dfsopto.com](https://dfsopto.com).

## Features
- **Default Projections**: Utilize built-in projections for players to quickly generate lineups.
- **Custom Projections**: Upload your own player projections to tailor the optimizer to your strategy.
- **Optimal Lineup Generation**: Create the highest scoring lineups based on the salary cap and your specific constraints.
- **Flexible Constraints**:
  - Unique players per lineup
  - Maximum players allowed from a single team
  - Maximum Offensive Players vs. Defense/Special Teams (DST)
  - Custom stacking rules (e.g., always include a quarterback with two of their wide receivers)
  - Exposure Caps (e.g., only allow this player in 75% of lineups max)

## Getting Started
### Homepage
The homepage provides an intuitive interface to start building your lineups. You can choose between using default projections or uploading your own.

### Uploading Projections
To upload your custom player projections:
1. Navigate to the "Upload Projections" section.
2. You have two options:
   - **Copy and Paste**: Copy and paste your player data directly into the spreadsheet available in the browser.
   - **Upload a File**: Alternatively, choose your file containing the player data and submit it for processing.

### Generating Lineups
To generate optimal lineups:
1. Type in the number of lineups you wish to generate. 
2. Select the constraints you want to apply:
   - Set the salary cap.
   - Define unique players and maximum players per team.
   - Choose any stacking rules.
   - Set player exposures (max percentage of lineups a player can come up in).
3. Click on "Generate Lineups" to view your optimal lineup recommendations.

### Analyzing Lineups
Once the lineups are generated:
- Review the suggested lineups based on your settings.
- Each lineup will display player selections, total projection, and total salary used.
- If you wish, adjust your settings and regenerate!

## Additional Features
- **Save Lineups**: If you are logged in your lineups will automatically save.
- **Export Options**: Download lineups in CSV format for easy upload to DraftKings.

## Resources
For more information, please visit our website at [dfsopto.com](https://dfsopto.com).
