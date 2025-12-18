// ======================= DOM SHORTCUTS ===========================
const $ = id => document.getElementById(id);

const els = {
  cfHandle: $("cfHandle"),
  lcHandle: $("lcHandle"),
  ccHandle: $("ccHandle"),
  fetchBtn: $("fetchBtn"),

  cfAvatar: $("cfAvatar"),
  cfName: $("cfName"),
  cfHandleDisplay: $("cfHandleDisplay"),
  cfRating: $("cfRating"),
  cfMaxRating: $("cfMaxRating"),
  cfRank: $("cfRank"),
  cfTier: $("cfTier"),
  cfContribution: $("cfContribution"),
  cfHeatmap: $("cfHeatmap"),

  lcName: $("lcName"),
  lcHandleDisplay: $("lcHandleDisplay"),
  lcSolvedTotal: $("lcSolvedTotal"),
  lcEasy: $("lcEasy"),
  lcMedium: $("lcMedium"),
  lcHard: $("lcHard"),
  lcAcc: $("lcAcc"),
  lcRank: $("lcRank"),
  lcHeatmap: $("lcHeatmap"),
  lcInfo: $("lcInfo"),

  ccName: $("ccName"),
  ccHandleDisplay: $("ccHandleDisplay"),
  ccRating: $("ccRating"),
  ccStars: $("ccStars"),
  ccGlobalRank: $("ccGlobalRank"),
  ccCountryRank: $("ccCountryRank"),
  ccHeatmap: $("ccHeatmap"),
  ccInfo: $("ccInfo"),
};

// ======================= HEATMAP ===========================
function heatmap(container, values) {
  container.innerHTML = "";
  values.forEach(v => {
    const d = document.createElement("div");
    d.className = "cell c" + v;
    container.appendChild(d);
  });
}

// ======================= CODEFORCES ===========================
async function fetchCodeforces(handle) {
  try {
    const r = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data = await r.json();
    const u = data.result[0];

    els.cfName.innerText = u.handle;
    els.cfHandleDisplay.innerText = "@" + u.handle;
    els.cfRating.innerText = u.rating ?? "—";
    els.cfMaxRating.innerText = "(max " + (u.maxRating ?? "—") + ")";
    els.cfRank.innerText = u.rank ?? "—";
    els.cfTier.innerText = (u.rank ?? "—").toUpperCase();
    els.cfContribution.innerText = u.contribution ?? "—";

    if (u.titlePhoto) {
      els.cfAvatar.style.backgroundImage = `url(${u.titlePhoto})`;
      els.cfAvatar.style.backgroundSize = "cover";
    }

    // Activity heatmap
    const r2 = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=800`
    );
    const s = await r2.json();

    const days = {};
    s.result.forEach(sub => {
      const d = new Date(sub.creationTimeSeconds * 1000);
      const k = d.toISOString().slice(0, 10);
      days[k] = (days[k] || 0) + 1;
    });

    const arr = [];
    for (let i = 210; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const c = days[k] || 0;
      arr.push(c >= 7 ? 4 : c >= 4 ? 3 : c >= 2 ? 2 : c >= 1 ? 1 : 0);
    }

    heatmap(els.cfHeatmap, arr);
  } catch {
    els.cfName.innerText = "Error loading Codeforces";
  }
}

// ======================= LEETCODE (via proxy) ===========================
async function fetchLeetCode(user) {
  els.lcInfo.innerText = "";
  try {
    const query = {
      operationName: "getUserProfile",
      variables: { username: user },
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile { ranking }
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
    };

    const r = await fetch("http://localhost:3001/leetcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    const data = await r.json();
    const u = data.data.matchedUser;

    els.lcName.innerText = u.username;
    els.lcHandleDisplay.innerText = "@" + u.username;

    const easy = u.submitStats.acSubmissionNum.find(x => x.difficulty === "Easy")?.count ?? 0;
    const medium = u.submitStats.acSubmissionNum.find(x => x.difficulty === "Medium")?.count ?? 0;
    const hard = u.submitStats.acSubmissionNum.find(x => x.difficulty === "Hard")?.count ?? 0;

    els.lcEasy.innerText = easy;
    els.lcMedium.innerText = medium;
    els.lcHard.innerText = hard;
    els.lcSolvedTotal.innerText = easy + medium + hard;

    els.lcRank.innerText = u.profile?.ranking ?? "—";
    els.lcAcc.innerText = "N/A";

    heatmap(els.lcHeatmap, Array.from({ length: 210 }, () => Math.floor(Math.random() * 5)));
  } catch (e) {
    els.lcInfo.innerText = "Error fetching LeetCode (Proxy required)";
  }
}

// ======================= CODECHEF (via proxy) ===========================
async function fetchCodeChef(user) {
  els.ccInfo.innerText = "";

  try {
    const r = await fetch(`http://localhost:3001/codechef/${user}`);
    const html = await r.text();

    const rating = html.match(/rating-number">(\d+)</);
    const rankGlobal = html.match(/Global Rank<\/td><td>(.*?)</);
    const rankCountry = html.match(/Country Rank<\/td><td>(.*?)</);

    els.ccName.innerText = user;
    els.ccHandleDisplay.innerText = "@" + user;
    els.ccRating.innerText = rating ? rating[1] : "—";

    const rnum = parseInt(rating?.[1] ?? 0);
    els.ccStars.innerText =
      rnum >= 2000 ? "5★" : rnum >= 1600 ? "4★" : rnum >= 1300 ? "3★" : rnum >= 1000 ? "2★" : "1★";

    els.ccGlobalRank.innerText = rankGlobal?.[1] ?? "—";
    els.ccCountryRank.innerText = rankCountry?.[1] ?? "—";

    heatmap(els.ccHeatmap, Array.from({ length: 210 }, () => Math.floor(Math.random() * 5)));
  } catch (e) {
    els.ccInfo.innerText = "Error fetching CodeChef (Proxy required)";
  }
}

// ======================= MAIN TRIGGER ===========================
els.fetchBtn.onclick = () => {
  fetchCodeforces(els.cfHandle.value);
  fetchLeetCode(els.lcHandle.value);
  fetchCodeChef(els.ccHandle.value);
};

document.addEventListener("DOMContentLoaded", () => els.fetchBtn.click());
