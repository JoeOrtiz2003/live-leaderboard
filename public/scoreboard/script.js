const sheetID = "1srwCRcCf_grbInfDSURVzXXRqIqxQ6_IIPG-4_gnSY8"; // Replace with your actual sheet ID
const sheetName = "LIVE"; // Replace with your actual sheet tab name
const query = "select AE, AO, AF, AH, AI, AK, AJ"; // Adjust to match your column setup
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&tq=${encodeURIComponent(query)}`;

// Function to fetch data from Google Sheets and populate the table
async function fetchAndDisplayData() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        console.log(text); // Log the raw response
        const json = JSON.parse(text.substring(47).slice(0, -2));
        console.log(json); // Log the parsed JSON

        // Access the rows from the sheet
        const rows = json.table.rows;

        // Get the left and right grouping containers
        const leftGrouping = document.getElementById('leftGrouping');
        const rightGrouping = document.getElementById('rightGrouping');

        // Clear existing content
        leftGrouping.innerHTML = '';
        rightGrouping.innerHTML = '';

        // Loop through rows and populate the table
        rows.forEach((row, index) => {
            // Extract values for each column
            const teamPosition = row.c[0] ? row.c[0].v : 'N/A';
            const teamLogo = row.c[1] ? row.c[1].v : '';
            const teamName = row.c[2] ? row.c[2].v : 'Unknown';
            const teamPlacePoints = row.c[3] ? row.c[3].v : '0';
            const teamElims = row.c[4] ? row.c[4].v : '0';
            const teamTotal = row.c[5] ? row.c[5].v : '0';
            const teamChickeDinner = row.c[6] ? row.c[6].v : '0';

            // Create a team bracket element
            const teamBraket = document.createElement('div');
            teamBraket.classList.add('teamBraket');
            teamBraket.innerHTML = `
                <div class="teamPositionWrapper">
                    <p class="teamPosition">${teamPosition}</p>
                </div>
                <div class="teamLogoWrapper">
                    <img class="teamLogo" style="display: ${teamLogo ? 'block' : 'none'}" src="${teamLogo}" alt="${teamName} Logo" onerror="this.onerror=null; this.src='default-logo.png';">
                    <p class="teamName">${teamName}</p>
                </div>
                <div class="teamPlacePointsWrapper">
                    <p class="teamPlacePoints">${teamPlacePoints}</p>
                </div>
                <div class="teamElimsWrapper">
                    <p class="teamElims">${teamElims}</p>
                </div>
                <div class="teamTotalWrapper">
                    <p class="teamTotal">${teamTotal}</p>
                    <div class="teamChickenDinnerWrapper">
                        <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 22" width="36" height="22">
                            <path fill-rule="evenodd" class="teamChickenDinnerIMG" d="m32 21.5h-28.5c-1.8 0-3.3-1.4-3.3-3.2 0-0.4 0.3-0.6 0.6-0.6 0.3 0 0.6 0.2 0.6 0.6 0 1.1 0.9 2 2.1 2h28.5c1.2 0 2.1-0.9 2.1-2 0-0.4 0.3-0.6 0.6-0.6 0.3 0 0.6 0.2 0.6 0.6 0 1.8-1.5 3.2-3.3 3.2zm-28.3-5.2q0 0 0 0c0-7 6.1-12.5 13.6-12.5 2.4 0 4.6 0.6 6.5 1.5q0.9-0.2 1.8-0.4 0 0 0.1 0 0.1 0 0.2 0 0.1 0 0.1 0 0 0 0 0 0.1-0.1 0.1-0.1 0 0 0.1 0 0 0 0 0 0.1 0 0.1 0 0 0 0.1-0.1 0 0 0 0 0.1 0 0.1 0 0.1 0 0.1 0 0.1 0 0.1 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0.1 0 0.1 0 0 0 0 0 0.1 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0 0 0 0 0 0.1 0 0 0 0 0.1 0 0.1-0.1 0 0 0 0 0 0 0 0.1 0 0-0.1 0.1 0 0 0 0.1 0 0.1-0.1 0.2 0 0 0 0.1 0 0 0 0.1 0 0-0.1 0 0 0.1 0 0.2 0 0 0 0-0.1 0.2-0.2 0.3c-0.7 1.6-1.8 3.1-2.9 4-0.9 0.7-2 1.1-3.1 1.2q-0.2 0-0.4 0c-4.1 0-5-3.3-5-3.3 0 0-0.1 4.2 5 4.2q0.2 0 0.4 0c1.3-0.1 2.6-0.6 3.7-1.4 1-0.8 2.1-2.2 2.9-3.7 0.7 1.5 1.1 3.2 1.1 5q0 0 0 0 0 1.9-1.3 3.3h-24.6c-0.9-1-1.4-2.1-1.4-3.3zm24.9-10.7c0 0.1 0.1 0.4 0.4 0.7 0.2 0.2 0.3 0.4 0.5 0.4l3-2.4c0 0 0.8 0.8 1.4 0.5 0.3-0.3 0.4-0.7 0.1-1-0.3-0.4-1.4-0.4-1.4-0.4 0 0 0.3-0.9-0.1-1.5q-0.1-0.2-0.4-0.2-0.3 0-0.5 0.1c-0.6 0.5-0.1 1.4-0.1 1.4z"></path>
                        </svg>
                        <p class="teamChickeDinner">x${teamChickeDinner}</p>
                    </div>
                </div>
            `;

            // Assign rows to left or right grouping based on rank
            if (index < 8) {
                leftGrouping.appendChild(teamBraket); // Ranks 1 to 8
            } else if (index >= 8 && index < 16) {
                rightGrouping.appendChild(teamBraket); // Ranks 9 to 16
            }
        });
    } catch (error) {
        console.error("Error fetching data from Google Sheets:", error);
    }
}



// Call the function to fetch and display the data every 5 seconds
fetchAndDisplayData(); // Initial fetch
setInterval(fetchAndDisplayData, 5000); // Auto-fetch every 5 seconds

function showScoreboard() {
  const left = document.getElementById('leftGrouping');
  const right = document.getElementById('rightGrouping');
  left.classList.remove('left-out');
  right.classList.remove('right-out');
  left.classList.add('left-in');
  right.classList.add('right-in');
  left.style.opacity = 1;
  right.style.opacity = 1;
}

function hideScoreboard() {
  const left = document.getElementById('leftGrouping');
  const right = document.getElementById('rightGrouping');
  left.classList.remove('left-in');
  right.classList.remove('right-in');
  left.classList.add('left-out');
  right.classList.add('right-out');
  // Optionally hide after animation
  setTimeout(() => {
    left.style.opacity = 0;
    right.style.opacity = 0;
  }, 350);
}

// Listen for show/hide commands from your backend or controller
window.addEventListener('message', (event) => {
  if (event.data === 'scoreboard_show') showScoreboard();
  if (event.data === 'scoreboard_hide') hideScoreboard();
});

// Optionally, for local testing, you can expose the functions
window.showScoreboard = showScoreboard;
window.hideScoreboard = hideScoreboard;

let lastAction = null;

setInterval(() => {
  fetch('/api/control')
    .then(res => res.json())
    .then(command => {
      if (command.action !== lastAction) {
        if (command.action === "scoreboard_show") {
          showScoreboard();
        } else if (command.action === "scoreboard_hide") {
          hideScoreboard();
        }
        lastAction = command.action;
      }
    });
}, 1000);

