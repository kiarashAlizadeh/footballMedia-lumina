import Tweets from '../module/Tweets';

// Component for profile Page
async function ProfilePage() {
  let id = window.location.toString().split('#')[1];

  let user;
  let users;
  let userData;
  let followingsListData;
  let followersListData;
  let tweetsList;
  let favoriteTeamData;

  async function fetchAuth() {
    const auth = await fetch('http://localhost:3000/api/auth', {
      method: 'Get',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    user = await auth.json();
    if (auth.status === 500) {
      const userLogin = false;

      // set redirect
      const url = window.location.toString();
      let d = new Date();
      d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
      let expires = 'expires=' + d.toUTCString();
      document.cookie = 'redirect=' + url + '; ' + expires + '; path=/;';

      window.location.href = '/signIn';
    } else if (auth.status === 200) {
      const userLogin = true;
    }

    const res = await fetch('http://localhost:3000/api/user');
    users = await res.json();

    const resUser = await fetch(`http://localhost:3000/api/user/${id}`);
    userData = await resUser.json();

    // list of followings
    const followings = await fetch(
      `http://localhost:3000/api/followingList/${user.userId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    followingsListData = await followings.json();

    // list of followers
    const followers = await fetch(
      `http://localhost:3000/api/followerList/${user.userId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    followersListData = await followers.json();

    // list of tweets
    const tweets = await fetch(`http://localhost:3000/api/tweet/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    tweetsList = await tweets.json();

    // favorite team data
    const favoriteTeam = await fetch(`http://localhost:3000/api/team/${id}`, {
      method: 'Get',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    favoriteTeamData = await favoriteTeam.json();
  }
  await fetchAuth();

  window.followHandler = async function (reqId) {
    // follow user
    const up = await fetch('http://localhost:3000/api/follow', {
      method: 'POST',
      body: JSON.stringify({
        reqId,
        userId: user.userId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await up.json();
    if (up.status === 200) {
      window.location.reload();
    }
  };

  window.unFollowHandler = async function (reqId) {
    // unFollow user
    const up = await fetch('http://localhost:3000/api/follow', {
      method: 'DELETE',
      body: JSON.stringify({
        reqId,
        userId: user.userId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await up.json();
    if (up.status === 200) {
      window.location.reload();
    }
  };

  window.followerLinkHandler = function () {
    window.location.href = `/followers#${id}`;
  };
  window.followingLinkHandler = function () {
    window.location.href = `/followings#${id}`;
  };

  window.goToUserProfile = function (userId) {
    window.location.href = `/profile#${userId}`;
    window.location.reload();
  };

  const title = `${userData.name + ' ' + userData.familyName} | Football Media`;
  document.title = title;

  return `
<div class="container">
  <div class="right">
    <div>
      <img class="image" src="../assets/images/upImage.jpg" alt="" />
    </div>
    <div class="suggestions">
      <h3>
        Suggestions
      </h3>
      ${
        users.length >= 1
          ? users
              .map((User) => {
                const isFollowing = followingsListData.some(
                  (followingUser) => followingUser.id === User._id
                );
                const isFollower = followersListData.some(
                  (followerUser) => followerUser.id === User._id
                );
                if (User._id === user.userId) {
                  return;
                }
                return `
      <div class="suggestionsUser">
        <a style="cursor:pointer;" onclick="goToUserProfile('${
          User._id
        }')" class="details">
          <img class="userImage" src="../assets/images/profile.png" alt="" />
          <span class="userDetails">
            <span class="detailName">
              ${User.name + ' ' + User.familyName}
            </span>
            <span class="detailId">
              @${User.userName}
            </span>
          </span>
        </a>
        ${
          isFollowing
            ? `
        <button class="unFollowBtn" onclick="unFollowHandler('${User._id}')">
          UnFollow
        </button>
        `
            : isFollower
            ? `
        <button class="followBtn" onclick="followHandler('${User._id}')">
          Follow back
        </button>
        `
            : `
        <button class="followBtn" onclick="followHandler('${User._id}')">
          Follow
        </button>
        `
        }
      </div>
      `;
              })
              .join(' ')
          : `
      <div>
        no User Found!
      </div>
      `
      }
    </div>
    <div class="predictions">
    </div>
    <a href="${window.location.toString()}" class="shareProfile">
      <span>
        <i class="bi bi-share-fill">
        </i>
        Share
      </span>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.toString()}"
      alt="qrCode">
    </a>
  </div>
  <div class="left">
    <div class="bio">
      <div class="profileImg">
        <img src="../assets/images/profile.png" alt="profileImg">
      </div>
      <div class="profileDesc">
        <div class="text">
          <span class="name">
            ${userData.name + ' ' + userData.familyName}
          </span>
          <span class="id">
            @${userData.userName}
          </span>
        </div>
        <div class="stats">
          <span>
            ${tweetsList.length} Tweets
          </span>
          <button onclick="followerLinkHandler()">
            <span>
              ${userData.followers.length} Follower
            </span>
          </button>
          <button onclick="followingLinkHandler()">
            <span>
              ${userData.followings.length} Following
            </span>
          </button>
          <div class="favoriteTeam">
            <img src="${favoriteTeamData.teamLogo}" alt="${
    favoriteTeamData.teamName
  }" />
          </div>
        </div>
        <div class="desc">
          ${
            userData.bio != ''
              ? `
          <p class="text">
            <span>
              <i class="bi bi-card-text">
              </i>
              ${userData.bio}
            </span>
          </p>
          `
              : ''
          } ${
    userData.yourLink != ''
      ? `
          <a href="${userData.link}" class="bioLink">
            <i class="bi bi-link-45deg">
            </i>
            ${userData.yourLink}
          </a>
          `
      : ''
  }
        </div>
      </div>
    </div>
    ${await Tweets(id)}
  </div>
</div>`;
}

export default ProfilePage;
