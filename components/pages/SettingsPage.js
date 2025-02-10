import footballTeams from '../../constant/footballTeams.js';

// Component for settings Page
async function SettingsPage() {
  const title = 'Settings | Football Media';
  document.title = title;

  let userLogin;
  let user;
  let userData;
  async function fetchAuth() {
    const auth = await fetch('http://localhost:3000/api/auth', {
      method: 'Get',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    user = await auth.json();
    if (auth.status === 500) {
      userLogin = false;

      // set redirect
      const url = window.location.toString();
      let d = new Date();
      d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
      let expires = 'expires=' + d.toUTCString();
      document.cookie = 'redirect=' + url + '; ' + expires + '; path=/;';

      window.location.href = '/signIn';
    } else if (auth.status === 200) {
      userLogin = true;
    }
    const resUser = await fetch(
      `http://localhost:3000/api/user/${user.userId}`,
      {
        method: 'Get',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    userData = await resUser.json();
  }
  await fetchAuth();

  window.handleUpdate = async function () {
    const name = document.getElementById('nameInput');
    const familyName = document.getElementById('FamilyNameInput');
    const userName = document.getElementById('userNameInput');
    const phone = document.getElementById('phoneInput');
    const email = document.getElementById('emailInput');
    const birthDate = document.getElementById('birthDateInput');
    const gender = document.getElementById('genderInput');
    const favoriteTeam = document.getElementById('favoriteTeamInput');
    const bio = document.getElementById('bioInput');
    const yourLink = document.getElementById('yourLinkInput');
    const link = document.getElementById('linkInput');

    function validate(item, value) {
      if (item === 'email') {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(String(value).toLowerCase());
      }
    }

    if (
      name.value === '' ||
      familyName.value === '' ||
      userName.value === '' ||
      phone.value === '' ||
      email.value === '' ||
      birthDate.value === '' ||
      gender.value === '' ||
      favoriteTeam.value === ''
    ) {
      return alert('You must fill the form before editing your data');
    } else if (!validate('email', email.value)) {
      return alert('please enter a valid email');
    } else {
      try {
        const res = await fetch(
          `http://localhost:3000/api/user/${user.userId}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              name: name.value,
              familyName: familyName.value,
              userName: userName.value,
              email: email.value,
              birthDate: birthDate.value,
              bio: bio.value,
              yourLink: yourLink.value,
              link: link.value,
              gender: gender.value,
              favoriteTeam: favoriteTeam.value,
              phone: phone.value,
            }),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const data = await res.json();
        if (res.status === 201) {
          alert('Your Account Data has been successfully updated!');
          window.location.reload();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return `
<div class="container">
  <div class="mainSetting">
    <div class="header">
      <h2>
        Settings
      </h2>
      <img class="profileImage" src="./assets/images/profile.png" alt="" />
    </div>
    <div class="settingContainer">
      <div>
        <span>
          <label>
            Name :
          </label>
          <input value="${
            userData.name
          }" type="text" id="nameInput" placeholder="Name" />
        </span>
        <span>
          <label>
            Phone Number :
          </label>
          <input value="${
            userData.phone
          }" type="text" id="phoneInput" placeholder="Phone Number" />
        </span>
        <span>
          <label>
            User Name :
          </label>
          <input value="${
            userData.userName
          }" type="text" id="userNameInput" placeholder="User Name" />
        </span>
        <span>
          <label>
            Birth Date :
          </label>
          <input value="${
            userData.birthDate
          }" type="date" id="birthDateInput" />
        </span>
      </div>
      <div>
        <span>
          <label>
            Family Name :
          </label>
          <input value="${
            userData.familyName
          }" type="text" id="FamilyNameInput" placeholder="Family Name" />
        </span>
        <span>
          <label>
            Email :
          </label>
          <input value="${
            userData.email
          }" type="email" id="emailInput" placeholder="Email" />
        </span>
        <span>
          <label>
            Favorite Team:
          </label>
          <select id="favoriteTeamInput">
            <option value="" disabled>
              Select your Favorite Team
            </option>
            <option ${
              userData.favoriteTeam === '65c1fe6be3d6499b5031b39e'
                ? 'selected'
                : ''
            } value="65c1fe6be3d6499b5031b39e">
              Chelsea FC
            </option>

            ${footballTeams
              .map(
                (team) =>
                  `
            <option ${
              userData.favoriteTeam === team.id ? 'selected' : ''
            } value="${team.id}">
              ${team.teamName}
            </option>
            `
              )
              .join('')}
          </select>
        </span>
        <span>
          <label>
            Gender :
          </label>
          <select id="genderInput">
            <option value="" disabled>
              Select Gender
            </option>
            <option ${
              userData.gender === 'MALE' ? 'selected' : ''
            } value="MALE">
              Male
            </option>
            <option ${
              userData.gender === 'FEMALE' ? 'selected' : ''
            } value="FEMALE">
              Female
            </option>
          </select>
        </span>
      </div>
    </div>
    <div class="bioLink">
      <label>
        Your Bio Link:
      </label>
      <div class="link">
        <input value="${
          userData.yourLink
        }" id="yourLinkInput" type="text" placeHolder="Your Link" />
        <input value="${
          userData.link
        }" id="linkInput" type="text" placeHolder="Link" />
      </div>
    </div>
    <textarea class="textArea" id="bioInput" cols="30" rows="6" placeHolder="Please Enter Your Bio">
      ${userData.bio}
    </textarea>
    <button class="settingBtn" onclick="handleUpdate()">
      Change
    </button>
    <p>
      Do You want to Change Your Password ?
      <a href="/changePassword">
        Click Here
      </a>
    </p>
  </div>
</div>`;
}

export default SettingsPage;
