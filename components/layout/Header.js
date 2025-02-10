// Component for header
async function Header() {
  let userLogin;
  let user;
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
  }

  await fetchAuth();

  window.signInHandler = function () {
    window.location.href = '/signIn';
  };

  window.logOutHandler = async function () {
    const resSignOut = await fetch('http://localhost:3000/api/signOut', {
      method: 'Get',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const ResSignOut = await resSignOut.json();
    window.location.href = '/signIn';
  };

  document.addEventListener('DOMContentLoaded', function () {
    let TextLogo = document.querySelector('.text');
    TextLogo.addEventListener('mouseover', () => {
      TextLogo.classList.remove('displayNone');
      TextLogo.classList.add('displayBlock');
    });
  });

  window.redirectToProfile = function () {
    window.location.href = '/profile#' + user.userId;
  };

  return `
<header>
  <nav>
    <a href="/" class="left">
      <img src="../assets/images/FootballMediaLogo.png" alt="FootballMediaLogo">
      <span class="text displayBlock">
        Football Media
      </span>
    </a>
    <ul class="center">
      <li>
        <a class="${
          window.location.pathname === '/' ? 'navActive' : null
        }" href="/">
          <i class="bi bi-house-fill">
          </i>
          Home
        </a>
      </li>
      ${
        userLogin
          ? `
      <li>
        <a class="${
          window.location.pathname === '/search' ? 'navActive' : null
        }" href="/search">
          <i class="bi bi-search">
          </i>
          Search
        </a>
      </li>
      `
          : ''
      } ${
    userLogin
      ? `
      <li>
        <a class="${
          window.location.pathname === '/profile' ? 'navActive' : null
        }" style="cursor:pointer;" onclick="redirectToProfile()">
          <i class="bi bi-person-lines-fill">
          </i>
          Profile
        </a>
      </li>
      `
      : ''
  }
      <li>
        <a class="${
          window.location.pathname === '/predict' ? 'navActive' : null
        }" href="/predict">
          <i class="bi bi-question-circle-fill">
          </i>
          Predict
        </a>
      </li>
      <li>
        <a class="${
          window.location.pathname === '/myTeam' ? 'navActive' : null
        }" href="/myTeam">
          <i class="bi bi-flag-fill">
          </i>
          My Team
        </a>
      </li>
      <li>
        <a class="${
          window.location.pathname === '/privacy' ? 'navActive' : null
        }" href="/privacy">
          <i class="bi bi-book-half">
          </i>
          Privacy
        </a>
      </li>
      ${
        userLogin
          ? `
      <li>
        <a class="${
          window.location.pathname === '/settings' ? 'navActive' : null
        }" href="/settings">
          <i class="bi bi-gear-fill">
          </i>
          Settings
        </a>
      </li>
      `
          : ''
      }
    </ul>
    ${
      !userLogin
        ? `
    <button onclick="signInHandler()" class="right">
      <i class="bi bi-box-arrow-in-right">
      </i>
      Sign In
    </button>
    `
        : `
    <div class="rightLogin">
      <span>
        <i class="bi bi-person-fill">
        </i>
        ${user.name}
      </span>
      <button onclick="logOutHandler()">
        <i class="bi bi-box-arrow-in-left">
        </i>
        Log Out
      </button>
      </div>
        `
    }
  </nav>
</header>`;
}

export default Header;
