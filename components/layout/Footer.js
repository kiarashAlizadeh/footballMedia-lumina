// Component for footer
async function Footer() {
  let userLogin;
  async function fetchAuth() {
    const auth = await fetch('http://localhost:3000/api/auth', {
      method: 'Get',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (auth.status === 500) {
      userLogin = false;
    } else if (auth.status === 200) {
      userLogin = true;
    }
  }

  await fetchAuth();
  return `
<footer>
  <div class="wave">
    <img src="../assets/images/footerWave.svg" alt="" />
  </div>
  <div class="footerContainer">
    <div class='left'>
      <p class="desc">
        There's no limit to sharing your emotions and discussing football here.
        Feel free.
      </p>
      <span class='footerLogo'>
        <p>
          Football Media
        </p>
        <img src='../assets/images/FootballMediaLogo.png' alt="FootballMediaLogo">
        </img>
      </span>
      <ul>
        <li>
          <a href="/">
            Home
          </a>
        </li>
        ${
          userLogin
            ? `
        <li>
          <a href="/profile">
            Profile
          </a>
        </li>
        `
            : ''
        }
        <li>
          <a href="/predict">
            Predict
          </a>
        </li>
        <li>
          <a href="/myTeam">
            My Team
          </a>
        </li>
        ${
          userLogin
            ? `
        <li>
          <a href="/settings">
            Settings
          </a>
        </li>
        `
            : ''
        }
        <li>
          <a href="/privacy">
            Privacy
          </a>
        </li>
      </ul>
    </div>
    <div class="right">
      <img class="gifImage" autoplay loop src="../assets/images/Football.gif"
      alt="FootballGif">
      </img>
    </div>
  </div>
  <div class="copyRightContainer">
    <div class="copyRight">
      Copyright © 2025 FOOTBALL MEDIA. All Rights Reserved.
    </div>
  </div>
</footer>`;
}

export default Footer;
