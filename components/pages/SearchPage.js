// Component for Search Page
async function SearchPage() {
  const title = 'Search | Football Media';
  document.title = title;

  let userLogin;
  let user;
  let loggedInUser;
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

    const resLoggedInUser = await fetch(
      `http://localhost:3000/api/user/${user.userId}`
    );
    loggedInUser = await resLoggedInUser.json();
  }
  await fetchAuth();

  window.searchTypeHandler = async function () {
    const searchType = document.getElementById('searchTypeInput').value;
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (searchType === 'USER') {
      searchBtn.setAttribute('onclick', 'searchUserHandler()');
      searchInput.setAttribute('placeholder', 'Search by User Name...');
    }
    if (searchType === 'TWEET') {
      searchBtn.setAttribute('onclick', 'searchTWEETHandler()');
      searchInput.setAttribute('placeholder', 'Search by Tweet Content...');
    }
  };

  let foundUserData;
  window.searchUserHandler = async function () {
    const search = document.getElementById('searchInput');
    const userDataContainer = document.getElementById('dataContainer');

    if (search.value === '') {
      return alert('You must enter a userName for search');
    }

    const resFoundUserData = await fetch(
      'http://localhost:3000/api/searchUserName',
      {
        method: 'POST',
        body: JSON.stringify({ userName: search.value }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    foundUserData = await resFoundUserData.json();

    if (resFoundUserData.status === 400) {
      userDataContainer.innerHTML = foundUserData.message;
    } else {
      userDataContainer.innerHTML = ''; // Clear previous content

      // Iterate over each user in foundUserData array
      foundUserData.map(async (foundUser) => {
        // Fetch tweets for the current user
        const tweets = await fetch(
          `http://localhost:3000/api/tweet/${foundUser._id}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const tweetsList = await tweets.json();

        // Fetch favorite team data for the current user
        const favoriteTeam = await fetch(
          `http://localhost:3000/api/team/${foundUser._id}`,
          {
            method: 'Get',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const favoriteTeamData = await favoriteTeam.json();

        userDataContainer.innerHTML += `
        <a href="${
          foundUser._id === user._id
            ? '/profile'
            : '/usersProfile#' + foundUser._id
        }" class="foundUser">
            <div class="details">
                <img class="profileImage" src="../assets/images/profile.png" alt="user Profile" />
                <span class="userDetails">
                    <span class="detailName">${
                      foundUser.name + ' ' + foundUser.familyName
                    }</span>
                    <span class="detailId">@${foundUser.userName}</span>
                </span>
            </div>
            <div class="stats">
                <span>${tweetsList.length} Tweets</span>
                <span onclick="followerLinkHandler()"><span>${
                  foundUser.followers.length
                } Follower</span></span>
                <span onclick="followingLinkHandler()"><span>${
                  foundUser.followings.length
                } Following</span></span>
                <div class="favoriteTeam"><img src="${
                  favoriteTeamData.teamLogo
                }" alt="${favoriteTeamData.teamName}" /> </div>
            </div>
            ${
              foundUser.bio != ''
                ? `
                <p class="profileBio"><span><i class="bi bi-card-text"> </i>${foundUser.bio} </span></p>
                `
                : ''
            }
        </a>`;
        const searchText = search.value;
        const userDetailTags = userDataContainer.querySelectorAll(
          '.detailName, .detailId'
        );
        userDetailTags.forEach((tag) => {
          const text = tag.textContent; // استفاده از textContent به جای innerHTML
          const regex = new RegExp(searchText, 'gi');
          const highlightedText = text.replace(
            regex,
            (match) => `<span class="searchActive">${match}</span>`
          );
          tag.innerHTML = highlightedText;
        });
      });
    }
  };

  let foundTweetData;
  window.searchTWEETHandler = async function () {
    const search = document.getElementById('searchInput');
    const tweetDataContainer = document.getElementById('dataContainer');

    if (search.value === '') {
      return alert('You must enter a tweet Content for search');
    }

    const resFoundTweetData = await fetch(
      'http://localhost:3000/api/searchTweetContent',
      {
        method: 'POST',
        body: JSON.stringify({ searchText: search.value }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    foundTweetData = await resFoundTweetData.json();
    console.log(foundTweetData);
    if (resFoundTweetData.status === 400) {
      tweetDataContainer.innerHTML = foundTweetData.message;
    } else {
      tweetDataContainer.innerHTML = ''; // Clear previous content

      tweetDataContainer.innerHTML = `${foundTweetData
        .map((tweet, index) => {
          const { date, time } = getDateTime(tweet.createdAt);
          return `
        <div class="userTweet">
            <div class="userInfo">
            <a href="${
              tweet.userId === user.userId
                ? '/profile'
                : '/usersProfile#' + tweet.userId
            }" class="userInfoLink">
            <img src="../assets/images/profile.png" alt="">
            <div class="text">
                <span class="name">${tweet.userNameAndFamilyName}</span>
                <span class="id">@${tweet.userName}</span>
            </div>
            </a>
                ${
                  tweet.userId === user.userId
                    ? `<button class="tweetDelete" data-tweet-id="${tweet._id}" onclick="tweetDeleteHandler(this)"><i class="bi bi-trash"></i></button>`
                    : ''
                }
            </div>
            <p class="userLastTweet">${tweet.tweetContent}
           </p>
           <div class="userIntract">
            <div>
            <button ${
              userLogin ? '' : 'disabled'
            }  onclick="tweetLikeHandler(this)" data-tweet-id="${
            tweet._id
          }" class="likes">
            ${
              tweet.likes.includes(user.userId)
                ? '<i class="bi bi-heart-fill"></i>'
                : '<i class="bi bi-heart"></i>'
            } ${tweet.likes.length}</button>
            <span class="comments"><i class="bi bi-chat-right-text"></i> ${
              tweet.comments.length
            }</span>
             </div>
            <span class="time"> <i class="bi bi-calendar-week-fill"></i> ${date} , <i class="bi bi-clock"></i> ${time}</span>
           </div>
           <div class="commentsSection">
           ${
             tweet.comments != 0
               ? `<h4>Comments: </h4>
           `
               : ''
           }
           
           ${tweet.comments
             .map((comment, index) => {
               const { date, time } = getDateTime(comment.dateTime);

               return `
               <div class="comment">
               <a href="${
                 comment.userId === user.userId
                   ? '/profile'
                   : '/usersProfile#' + comment.userId
               }" class="userInfo">
               <div>
               <img src="../assets/images/profile.png" alt="userProfile">
               <div class="text">
                 <span class="name">${comment.userNameAndFamilyName}</span>
                 <span class="id">@${comment.userName}</span>
               </div>
             </div>
               <div class="time"><i class="bi bi-calendar-week-fill"></i> ${date} , <i class="bi bi-clock"></i> ${time}
               </div>
             </a>
                    <div class="othersComment">
                    <p>${comment.commentContent}</p>
                    <span>
                    <button ${
                      userLogin ? '' : 'disabled'
                    } onclick="commentLikeHandler(this)" data-tweet-id="${
                 tweet._id
               }" data-comment-id="${index}">${
                 comment.likes.includes(user.userId)
                   ? '<i class="bi bi-heart-fill"></i>'
                   : '<i class="bi bi-heart"></i>'
               } ${comment.likes.length}</button>
                    ${
                      tweet.userId === user.userId
                        ? `<button class="tweetDelete" data-tweet-id="${tweet._id}" data-comment-id="${index}" onclick="commentDeleteHandler(this)" style="padding-left: 12px;"><i class="bi bi-trash"></i></button>`
                        : comment.userId === user.userId
                        ? `<button class="tweetDelete" data-tweet-id="${tweet._id}" data-comment-id="${index}" onclick="commentDeleteHandler(this)"><i class="bi bi-trash" style="padding-left: 12px;"></i></button>`
                        : ''
                    }
                    </span>
                    </div>
              </div>`;
             })
             .join('')}

           </div>
           ${
             userLogin
               ? `<div class="userInfo" id="comment" >
                       <input type="text" id="commentInput_${index}" class="comment" placeholder="${
                   tweet.userId === user._id
                     ? 'add a comment for yourself'
                     : `${'add a comment for ' + tweet.userNameAndFamilyName}`
                 }">
                       <button class="commentBtn" onclick='commentHandler(${index}, "${
                   tweet._id
                 }")'>comment</button>
                   </div>`
               : ''
           }
           
           </div>`;
        })
        .join('')}`;
    }

    const searchText = search.value;
    const paragraphs = tweetDataContainer.querySelectorAll('p');
    paragraphs.forEach((paragraph) => {
      const text = paragraph.innerHTML;
      const regex = new RegExp(searchText, 'gi');
      const highlightedText = text.replace(
        regex,
        (match) => `<span class="searchActive">${match}</span>`
      );
      paragraph.innerHTML = highlightedText;
    });
  };

  window.commentHandler = async function (index, tweetId) {
    const commentContent = document.getElementById(
      `commentInput_${index}`
    ).value;
    if (commentContent === '') {
      return alert('comment can not be empty');
    }
    // comment on tweet
    const up = await fetch('http://localhost:3000/api/comment', {
      method: 'POST',
      body: JSON.stringify({
        tweetId,
        userId: loggedInUser._id,
        userNameAndFamilyName:
          loggedInUser.name + ' ' + loggedInUser.familyName,
        userName: loggedInUser.userName,
        commentContent,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await up.json();
    if (up.status === 201) {
      window.location.reload();
    } else {
      alert(data);
    }
  };

  window.tweetLikeHandler = async function (button) {
    const tweetId = button.getAttribute('data-tweet-id');
    // like tweet
    const up = await fetch('http://localhost:3000/api/like', {
      method: 'POST',
      body: JSON.stringify({
        tweetId,
        userId: user.userId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await up.json();
    if (up.status === 201) {
      window.location.reload();
    } else {
      alert(data.message);
    }
  };

  window.tweetDeleteHandler = async function (button) {
    const tweetId = button.getAttribute('data-tweet-id');
    // like tweet
    const up = await fetch(`http://localhost:3000/api/tweet/${tweetId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await up.json();
    if (up.status === 201) {
      window.location.reload();
    } else {
      alert(data.message);
    }
  };

  window.commentLikeHandler = async function (button) {
    const tweetId = button.getAttribute('data-tweet-id');
    const commentIndex = button.getAttribute('data-comment-id');
    // like tweet
    const up = await fetch('http://localhost:3000/api/likeComment', {
      method: 'POST',
      body: JSON.stringify({
        tweetId,
        commentIndex,
        userId: user.userId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await up.json();
    if (up.status === 201) {
      window.location.reload();
    } else {
      alert(data.message);
    }
  };

  window.commentDeleteHandler = async function (button) {
    const tweetId = button.getAttribute('data-tweet-id');
    const commentIndex = button.getAttribute('data-comment-id');
    // like tweet
    const up = await fetch('http://localhost:3000/api/deleteComment', {
      method: 'POST',
      body: JSON.stringify({
        tweetId,
        commentIndex,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await up.json();
    if (up.status === 200) {
      window.location.reload();
    } else {
      alert(data.message);
    }
  };

  // Function to extract date and time components from a given date string
  function getDateTime(dateString) {
    // Check the input format
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) {
      throw new Error('Invalid date and time format.');
    }

    // Convert the string to a Date object
    const dateObject = new Date(dateString);

    // Extract the date and time
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // 0-based index
    const day = dateObject.getDate();
    const hour = dateObject.getHours().toString().padStart(2, '0');
    const minute = dateObject.getMinutes().toString().padStart(2, '0');
    const second = dateObject.getSeconds().toString().padStart(2, '0');

    // Format the date and time
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hour}:${minute}:${second}`;

    // Return the values
    return {
      date: formattedDate,
      time: formattedTime,
    };
  }

  return `
<div class="container">
  <div class="searchContainer">
    <select id="searchTypeInput" onchange="searchTypeHandler()">
      <option selected value="USER">
        User
      </option>
      <option value="TWEET">
        Tweet
      </option>
    </select>
    <input type="text" id="searchInput" placeholder="Search by UserName..."
    />
    <button id="searchBtn" onclick="searchUserHandler()" class="searchBtn">
      Search
    </button>
  </div>
  <div id="dataContainer">
  </div>
</div>`;
}

export default SearchPage;
