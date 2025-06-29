let lastAction = null;

setInterval(() => {
  fetch("/api/control")
    .then(res => res.json())
    .then(command => {
      if (command.action !== lastAction) {
        if (command.action === "hide") {
          animateMainDiv("hide");
        } else if (command.action === "show") {
          animateMainDiv("show");
        }
        lastAction = command.action;
      }
    });
}, 1000);

function animateMainDiv(direction) {
  const mainDiv = document.getElementById("mainDiv");
  mainDiv.classList.remove("slide-in-left", "slide-out-right");
  if (direction === "show") {
    mainDiv.style.opacity = 1;
    mainDiv.classList.add("slide-in-left");
    mainDiv.addEventListener("animationend", () => {
      mainDiv.classList.remove("slide-in-left");
    }, { once: true });
  } else if (direction === "hide") {
    mainDiv.classList.add("slide-out-right");
    mainDiv.addEventListener("animationend", () => {
      mainDiv.classList.remove("slide-out-right");
      mainDiv.style.opacity = 0;
    }, { once: true });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const mainDiv = document.getElementById("mainDiv");
  mainDiv.style.display = "flex";

  createRankingElements(16);
  fetchRankingData();
  setInterval(fetchRankingData, 1000);
});

const sheetID = "1srwCRcCf_grbInfDSURVzXXRqIqxQ6_IIPG-4_gnSY8";
const sheetName = "LIVE";
const query = "select AZ, BA, BB, BC, BD";
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&tq=${encodeURIComponent(query)}`;

let previousRanks = {};

function createRankingElements(count = 16) {
  const wrapper = document.getElementById("rankingElementsWrapper");
  wrapper.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const div = document.createElement("div");
    div.className = "rankingElement";
    div.setAttribute("data-position", i);
    div.innerHTML = `
      <div class="rankingElementBackground"></div>
      <div class="rankingElementWrapper">
        <p class="rankingElementRank"></p>
        <div class="rankingElementLogoWrapper">
          <div class="rankingElementNoLogo"></div>
          <img class="rankingElementLogo" src="logo.png" alt="Logo" />
          <p class="rankingElementName"></p>
        </div>
        <div class="rankingElementAliveWrapper">
          <div class="rankingElementAlive"></div>
          <div class="rankingElementAlive"></div>
          <div class="rankingElementAlive"></div>
          <div class="rankingElementAlive"></div>
        </div>
        <p class="rankingElementKills"></p>
      </div>
    `;
    wrapper.appendChild(div);
  }
}

async function fetchRankingData() {
  try {
    const response = await fetch(sheetURL);
    const text = await response.text();
    const jsonText = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/);
    if (!jsonText) throw new Error("Invalid JSON format");

    const jsonData = JSON.parse(jsonText[1]);
    const rows = jsonData.table.rows.map(row => ({
      rank: row.c[0]?.v ?? "#",
      team: row.c[1]?.v?.toString().trim() ?? "Unknown",
      elims: row.c[2]?.v ?? 0,
      logo: row.c[3]?.v ?? "https://placehold.co/22x22/000000/FFF?text=?",
      alive: row.c[4]?.v ?? 0
    }));

    updateRankingElements(rows);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function updateRankingElements(data) {
  const newRanks = {};

  data.forEach((team, index) => {
    newRanks[team.team] = index;
  });

  data.forEach((teamData, index) => {
    const element = document.querySelector(`.rankingElement[data-position="${index + 1}"]`);
    if (!element) return;

    const prevIndex = previousRanks[teamData.team];

    if (prevIndex !== undefined && index < prevIndex) {
      element.classList.add("slide-up");
      element.addEventListener("animationend", () => {
        element.classList.remove("slide-up");
      }, { once: true });
    }

    element.querySelector(".rankingElementRank").textContent = `#${teamData.rank}`;
    element.querySelector(".rankingElementName").textContent = teamData.team;
    element.querySelector(".rankingElementLogo").src = teamData.logo;
    element.querySelector(".rankingElementKills").textContent = teamData.elims;

    const aliveBoxes = element.querySelectorAll(".rankingElementAlive");
    aliveBoxes.forEach((box, i) => {
      box.style.backgroundColor = i < teamData.alive ? "#ffffff" : "#4e4e4e";
    });

    if (teamData.alive === 0) {
      element.classList.add("fadedTeam");
    } else {
      element.classList.remove("fadedTeam");
    }
  });

  previousRanks = { ...newRanks };
}

const mainDiv = document.getElementById("mainDiv");

function animateColumns(direction) {
  const rows = Array.from(document.querySelectorAll(".rankingElement"));
  if (direction === "show") {
    rows.forEach((row, i) => {
      const cols = [
        row.querySelector(".rankingElementRank"),
        row.querySelector(".rankingElementLogoWrapper"),
        row.querySelector(".rankingElementAliveWrapper"),
        row.querySelector(".rankingElementKills"),
      ];
      cols.forEach((col, j) => {
        col.style.opacity = 0;
        col.classList.remove("slide-out-right");
        setTimeout(() => {
          col.classList.add("slide-in-left");
          col.style.opacity = 1;
          col.addEventListener("animationend", () => {
            col.classList.remove("slide-in-left");
          }, { once: true });
        }, i * 80 + j * 40); // stagger per row and column
      });
    });
  } else if (direction === "hide") {
    rows.slice().reverse().forEach((row, i) => {
      const cols = [
        row.querySelector(".rankingElementRank"),
        row.querySelector(".rankingElementLogoWrapper"),
        row.querySelector(".rankingElementAliveWrapper"),
        row.querySelector(".rankingElementKills"),
      ];
      cols.forEach((col, j) => {
        col.classList.remove("slide-in-left");
        setTimeout(() => {
          col.classList.add("slide-out-right");
          col.addEventListener("animationend", () => {
            col.classList.remove("slide-out-right");
            col.style.opacity = 0;
          }, { once: true });
        }, i * 80 + j * 40); // stagger per row and column
      });
    });
  }
}
