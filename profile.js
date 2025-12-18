/* profile.js
 - Fetches CF, LC, CC summary and renders the profile page.
 - Requires proxy.js running at http://localhost:3001 for LeetCode + CodeChef.
*/

const $ = id => document.getElementById(id);

// Handles
const CF_HANDLE = 'Hardik_Bhochiya';
const LC_HANDLE = 'Hardik_032';
const CC_HANDLE = 'hardik_032';

// DOM references
const pfAvatar = $('pfAvatar');
const pfName = $('pfName');
const pfBio = $('pfBio');

const pfCFHandle = $('pfCFHandle');
const pfLCHandle = $('pfLCHandle');
const pfCCHandle = $('pfCCHandle');

const pfCFRating = $('pfCFRating');
const pfCFTier = $('pfCFTier');
const pfLCSolved = $('pfLCSolved');
const pfLCRank = $('pfLCRank');
const pfCCRating = $('pfCCRating');
const pfCCStars = $('pfCCStars');

const pfSolvedTotal = $('pfSolvedTotal');
const pfSolvedBreakdown = $('pfSolvedBreakdown');
const pfRecent = $('pfRecent');

const pfCFHeatmap = $('pfCFHeatmap');
const pfLCHeatmap = $('pfLCHeatmap');
const pfCCHeatmap = $('pfCCHeatmap');

const pfBadges = $('pfBadges');

// Helpers
function clear(el) { el.innerHTML = ''; }
function heatmap(container, values) {
  clear(container);
  values.forEach(v => {
    const d = document.createElement('div');
    d.className = 'cell c' + v;
    container.appendChild(d);
  });
}

// ---------------------------- CODEFORCES ----------------------------
async function loadCF(handle) {
  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`);
    const data = await res.json();

    if (data.status !== 'OK') throw new Error('CF API error');

    const u = data.result[0];

    pfCFHandle.innerText = u.handle;
    pfCFRating.innerText = u.rating ?? '—';
    pfCFTier.innerText = (u.rank ?? '—').toUpperCase();

    if (u.titlePhoto) {
      pfAvatar.style.backgroundImage = `url(${u.titlePhoto})`;
      pfAvatar.style.backgroundSize = 'cover';
    }

    // activity heatmap
    const sres = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`);
    const sdata = await sres.json();

    const byDay = {};
    if (sdata.status === 'OK') {
      sdata.result.forEach(sub => {
        const d = new Date(sub.creationTimeSeconds * 1000);
        const key = d.toISOString().slice(0, 10);
        byDay[key] = (byDay[key] || 0) + 1;
      });
    }

    const arr = [];
    for (let i = 210; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const c = byDay[k] || 0;
      arr.push(c >= 7 ? 4 : c >= 4 ? 3 : c >= 2 ? 2 : c >= 1 ? 1 : 0);
    }

    heatmap(pfCFHeatmap, arr);
  }
  catch (e) {
    console.warn("CF load error:", e);
  }
}

// ---------------------------- LEETCODE ----------------------------
async function loadLC(user) {
  try {
    const query = {
      operationName: "getUserProfile",
      variables: { username: user },
      query: `
      query getUserProfile($username:String!){
        matchedUser(username:$username){
          username
          profile{ ranking userAvatar }
          submitStats{
            acSubmissionNum{
              difficulty
              count
            }
          }
        }
      }`
    };

    const res = await fetch("http://localhost:3001/leetcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });

    const data = await res.json();
    const u = data.data.matchedUser;

    pfLCHandle.innerText = '@' + (u?.username || user);

    const easy = u?.submitStats?.acSubmissionNum?.find(x => x.difficulty === "Easy")?.count || 0;
    const med = u?.submitStats?.acSubmissionNum?.find(x => x.difficulty === "Medium")?.count || 0;
    const hard = u?.submitStats?.acSubmissionNum?.find(x => x.difficulty === "Hard")?.count || 0;

    pfLCSolved.innerText = `${easy + med + hard} (${easy} easy / ${med} medium / ${hard} hard)`;
    pfLCRank.innerText = u?.profile?.ranking ?? "—";

    pfSolvedTotal.innerText = easy + med + hard;
    pfSolvedBreakdown.innerText = `${easy} / ${med} / ${hard}`;

    // temporary random heatmap
    heatmap(pfLCHeatmap, Array.from({ length: 210 }, () => Math.floor(Math.random() * 5)));
  }
  catch (e) {
    console.warn("LC load error:", e);
    heatmap(pfLCHeatmap, Array.from({ length: 210 }, () => 0));
  }
}

// ---------------------------- CODECHEF ----------------------------
async function loadCC(user) {
  try {
    const res = await fetch(`http://localhost:3001/codechef/${encodeURIComponent(user)}`);
    const html = await res.text();

    pfCCHandle.innerText = '@' + user;

    const rating = html.match(/rating-number">(\d+)/);
    const rnum = rating ? parseInt(rating[1]) : 0;

    pfCCRating.innerText = rating ? rating[1] : "—";
    pfCCStars.innerText =
      rnum >= 2000 ? "5★" :
      rnum >= 1600 ? "4★" :
      rnum >= 1300 ? "3★" :
      rnum >= 1000 ? "2★" : "1★";

    heatmap(pfCCHeatmap, Array.from({ length: 210 }, () => Math.floor(Math.random() * 5)));
  }
  catch (e) {
    console.warn("CC load error:", e);
    heatmap(pfCCHeatmap, Array.from({ length: 210 }, () => 0));
  }
}

// ---------------------------- BADGES ----------------------------
function addBadge(text) {
  const b = document.createElement("div");
  b.className = "badge";
  b.innerText = text;
  pfBadges.querySelector(".badges-row").appendChild(b);
}

// ---------------------------- MAIN ----------------------------
async function loadProfile() {
  pfName.innerText = "Hardik Bhochiya";
  pfBio.innerText = "Student · Competitive Programmer · Building Competitive Buddy";

  await Promise.all([
    loadCF(CF_HANDLE),
    loadLC(LC_HANDLE),
    loadCC(CC_HANDLE)
  ]);

  // badges
  clear(pfBadges.querySelector(".badges-row"));
  addBadge("CF: Newbie");
  addBadge("LC: 200+ solved");
  addBadge("CC: 1★");

  // recent (demo)
  clear(pfRecent);
  ["Solved LC: Two Sum", "CF: Solved 1234A", "Participated CC Long Challenge"]
    .forEach(x => {
      const li = document.createElement("li");
      li.innerText = x;
      pfRecent.appendChild(li);
    });
}

window.addEventListener("DOMContentLoaded", loadProfile);
