// Component for My team Page
async function MyTeamPage() {
  let userLogin;
  let user;
  let team;
  async function fetchAuth() {
    const auth = await fetch('http://localhost:3000/api/auth', {
      method: 'Get',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    user = await auth.json();
    if (auth.status === 500) {
      userLogin = false;
    } else if (auth.status === 200) {
      userLogin = true;
    }

    const res = await fetch(`http://localhost:3000/api/team/${user.userId}`, {
      method: 'Get',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    team = await res.json();
  }
  await fetchAuth();

  const title = `${team.teamName} | Football Media`;
  document.title = title;

  return `
<section class="container">
  <div class="head">
    ${
      userLogin
        ? `
    <h1 class="teamName">
      ${team.teamName}
    </h1>
    `
        : ''
    }
    <span class="logo">
      My Favorite Team
    </span>
    <span class="logo">
      Football
      <span>
        Media
      </span>
    </span>
  </div>
  <div class="teamInfo">
    ${
      userLogin
        ? `
    <div class="teamFormation">
      <span class="text">
        Team Formation
      </span>
      <img src="${team.teamFormation}" alt="Team Formation">
      <div class="teamPlayers">
        ${team.players
          .map((player) => {
            return `
        <div class="player">
          <span class="playerName">
            ${player}
          </span>
        </div>
        `;
          })
          .join('')}
      </div>
    </div>
    <div class="teamDesc">
      <p class="title">
        About ${team.teamName}
      </p>
      <p class="wikipedia">
        ${team.aboutTeam}
      </p>
      <div class="teamGallery">
        <h2 class="text">
          Gallery
        </h2>
        <div class="images">
          <div class="up">
            ${team.gallery
              .map((image) => {
                return `
            <img src="${image}" alt="${team.teamName}">
            </img>
            `;
              })
              .join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="teamSummery">
      <div class="teamLogo">
        <img src="${team.teamLogo}" alt="${team.teamName}">
      </div>
      <div class="teamShortInfo">
        <div class="title">
          <span class="titleItem">
            Full name :
          </span>
          <span class="titleItem">
            Nickname :
          </span>
          <span class="titleItem">
            Founded :
          </span>
          <span class="titleItem">
            Ground :
          </span>
          <span class="titleItem">
            League :
          </span>
        </div>
        <div class="value">
          <span class="titleValue">
            ${team.teamFullName}
          </span>
          <span class="titleValue">
            ${team.nickName}
          </span>
          <span class="titleValue">
            ${team.founded}
          </span>
          <span class="titleValue">
            ${team.ground}
          </span>
          <span class="titleValue">
            ${team.league}
          </span>
        </div>
      </div>
      <a href="/predict" class="teamPredictPage">
        <span class="text">
          Want to predict Match?
        </span>
        <img src="../assets/images/predictImage.jpg" alt="" class="clickHere">
      </a>
    </div>
    `
        : 'you must login before see your favorite team!'
    }
  </div>
</section>`;
}

export default MyTeamPage;
