let lastAction = null;

setInterval(() => {
  fetch("/api/control")
    .then(res => res.json())
    .then(command => {
      if (command.action !== lastAction) {
        if (command.action === "hide") {
          animateColumns("hide");
        } else if (command.action === "show") {
          animateColumns("show");
        }
        lastAction = command.action;
      }
    });
}, 1000);

function animateColumns(direction) {
  const header = document.querySelector('.rankingHeader');
  const rows = Array.from(document.querySelectorAll('.rankingElement'));
  const lower = document.querySelector('.lowerHeader');
  const all = [header, ...rows, lower].filter(Boolean);
  const mainDiv = document.getElementById("mainDiv");

  let indices = direction === "show"
    ? [...all.keys()]
    : [...all.keys()].reverse();

  // For "show", hide all before animating in
  if (direction === "show") {
    all.forEach(el => {
      el.style.opacity = 0;
      el.style.visibility = "hidden";
    });
    mainDiv.style.height = "";
    mainDiv.style.overflow = "";
  }

  function animateNext(i) {
    if (i >= indices.length) {
      if (direction === "hide") {
        mainDiv.style.height = "0";
        mainDiv.style.overflow = "hidden";
      }
      return;
    }
    const el = all[indices[i]];
    el.classList.remove('stagger-animate-in', 'stagger-animate-out');
    el.style.animationDelay = "0ms"; // No delay

    if (direction === "show") {
      el.style.visibility = "visible";
      el.classList.add('stagger-animate-in');
      el.addEventListener('animationend', function handler() {
        el.classList.remove('stagger-animate-in');
        el.style.opacity = 1;
        el.style.animationDelay = "0ms";
        el.removeEventListener('animationend', handler);
        animateNext(i + 1);
      });
    } else {
      el.style.visibility = "visible";
      el.classList.add('stagger-animate-out');
      el.addEventListener('animationend', function handler() {
        el.classList.remove('stagger-animate-out');
        el.style.opacity = 0;
        el.style.visibility = "hidden";
        el.style.animationDelay = "0ms";
        el.removeEventListener('animationend', handler);
        animateNext(i + 1);
      });
    }
  }
  animateNext(0);
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
