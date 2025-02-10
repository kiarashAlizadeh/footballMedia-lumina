// Component for sign In Page
async function SignInPage() {
  const title = 'SignIn | Football Media';
  document.title = title;

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
      window.location.href = '/';
    }
  }
  await fetchAuth();

  // A function to extract the value of a cookie with a specific name
  function getCookie(cookieName) {
    var name = cookieName + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
      var cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }

  window.handleSignIn = async function () {
    const email = document.getElementById('emailInput');
    const pass = document.getElementById('passwordInput');

    if (email.value === '' || pass.value === '') {
      alert('You must fill the form before signing In');
    } else {
      try {
        const res = await fetch('http://localhost:3000/api/auth', {
          method: 'POST',
          body: JSON.stringify({
            email: email.value,
            pass: pass.value,
          }),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (res.status === 400) {
          return alert(data.message);
        } else {
          // Get the value of the cookie with the name "redirect"
          var redirectURL = getCookie('redirect');

          alert('You are Logged In!');
          // Check if a cookie with the desired value exists or not
          if (redirectURL != '') {
            console.log(redirectURL);
            document.cookie =
              'redirect=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = redirectURL;
          } else {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return `
<div class="container">
  <div class="background">
    <img src="../assets/images/closeUpFootball.jpg" alt="" />
  </div>
  <div class="formContainer">
    <h3>
      Sign In
    </h3>
    <input type="email" id="emailInput" placeholder="Email">
    <input type="password" id="passwordInput" placeholder="Password">
    <button class="signInBtn" onclick="handleSignIn()">
      Sign In
    </button>
    <div class="dontHaveAccount">
      <p>
        Don't have an account?
      </p>
      <a href="/signUp">
        Sign Up
      </a>
    </div>
  </div>
</div>`;
}

export default SignInPage;
