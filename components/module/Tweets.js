// Tweets Component
async function Tweets(id) {
  let user;
  let loggedInUser;
  let tweetsList;
  async function fetchContent() {
    // get login user
    const auth = await fetch('http://localhost:3000/api/auth', {
      method: 'Get',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    user = await auth.json();

    // get loggedInUser data
    const resLoggedInUser = await fetch(
      `http://localhost:3000/api/user/${user.userId}`
    );
    loggedInUser = await resLoggedInUser.json();

    if (id === 'ALL') {
      // list of all tweets
      const tweets = await fetch(`http://localhost:3000/api/tweet`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      tweetsList = await tweets.json();
    } else {
      // list of req user tweets
      const tweets = await fetch(`http://localhost:3000/api/tweet/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      tweetsList = await tweets.json();
    }
  }
  await fetchContent();

  window.tweetHandler = async function () {
    const tweetContent = document.getElementById('tweetContent').value;
    if (tweetContent === '') {
      return alert('tweet can not be empty');
    }
    // tweet user
    const up = await fetch('http://localhost:3000/api/tweet', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.userId,
        userNameAndFamilyName:
          loggedInUser.name + ' ' + loggedInUser.familyName,
        userName: loggedInUser.userName,
        tweetContent,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await up.json();
    if (up.status === 200) {
      window.location.reload();
    }
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
        userId: loggedInUser._id,
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

  window.commentLikeHandler = async function (button) {
    const tweetId = button.getAttribute('data-tweet-id');
    const commentIndex = button.getAttribute('data-comment-id');
    // like comment
    const up = await fetch('http://localhost:3000/api/likeComment', {
      method: 'POST',
      body: JSON.stringify({
        tweetId,
        commentIndex,
        userId: loggedInUser._id,
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

  window.goToUserProfile = function (userId) {
    window.location.href = `/profile#${userId}`;
    if (id != 'ALL') {
      window.location.reload();
    }
  };

  return `
        ${
          loggedInUser.userName && (user.userId === id || id === 'ALL')
            ? `<div class="tweets">
      <div class="tweetName">
        <img src="../assets/images/profile.png" alt="img">
        <div class="text">
          <span class="name">
            ${loggedInUser.name + ' ' + loggedInUser.familyName}
          </span>
          <span class="id">
            @${loggedInUser.userName}
          </span>
        </div>
      </div>
      <div class="tweeting" ">
      <textarea placeholder="What 's happening?" cols="65" rows="5" id="tweetContent"></textarea>
      <button onclick="tweetHandler()">Tweet &nbsp; <i class="bi bi-send-fill"></i></button>
      </div>
    </div>`
            : `
      <div class="!max-w-[300px]">
     <a href="/signIn" class="bg-green-600 !text-white !px-4 !py-2 rounded-xl !mx-auto block w-fit">SignIn</a>
      </div>    
    `
        }
      ${
        tweetsList.length === 0
          ? `<div style="color:white">There is no tweet in Football Media!</div>
        `
          : tweetsList
              .reverse()
              .map((tweet, index) => {
                const { date, time } = getDateTime(tweet.createdAt);
                return `
        <div class="userTweet">
          <div class="userInfo">
          ${
            id === 'ALL'
              ? `<a style="cursor:pointer;" onclick="goToUserProfile('${tweet.userId}')" class="userInfoLink">
              <img src="../assets/images/profile.png" alt="">
              <div class="text">
                <span class="name">
                  ${tweet.userNameAndFamilyName}
                </span>
                <span class="id">
                  @${tweet.userName}
                </span>
              </div>
            </a>`
              : `<div class="userInfoLink">
              <img src="../assets/images/profile.png" alt="">
              <div class="text">
                <span class="name">
                  ${tweet.userNameAndFamilyName}
                </span>
                <span class="id">
                  @${tweet.userName}
                </span>
              </div>
            </div>`
          }
            
            ${
              tweet.userId === user.userId
                ? `
        <button class="tweetDelete" data-tweet-id="${tweet._id}" onclick="tweetDeleteHandler(this)">
          <i class="bi bi-trash">
          </i>
        </button>
        `
                : ''
            }
          </div>
          <p class="userLastTweet">
            ${tweet.tweetContent}
          </p>
          <div class="userIntract">
            <div>
              <button onclick="tweetLikeHandler(this)" data-tweet-id="${
                tweet._id
              }" class="likes">
                ${
                  tweet.likes.includes(loggedInUser._id)
                    ? `
                <i class="bi bi-heart-fill">
                </i>
                `
                    : `
                <i class="bi bi-heart">
                </i>
                `
                } ${tweet.likes.length}
              </button>
              <span class="comments">
                <i class="bi bi-chat-right-text">
                </i>
                ${tweet.comments.length}
              </span>
            </div>
            <span class="time">
              <i class="bi bi-calendar-week-fill">
              </i>
              ${date} ,
              <i class="bi bi-clock">
              </i>
              ${time}
            </span>
          </div>
          <div class="commentsSection">
            ${
              tweet.comments != 0
                ? `
            <h4>
              Comments:
            </h4>
            `
                : ''
            } ${tweet.comments
                  .map((comment, index) => {
                    const { date, time } = getDateTime(comment.dateTime);
                    return `
            <div class="comment">
              <a style="cursor:pointer;" onclick="goToUserProfile('${
                comment.userId
              }')" class="userInfo">
                <div class="userInfoLink">
                  <img src="../assets/images/profile.png" alt="userProfile">
                  <div class="text">
                    <span class="name">
                      ${comment.userNameAndFamilyName}
                    </span>
                    <span class="id">
                      @${comment.userName}
                    </span>
                  </div>
                </div>
                <div class="time">
                  <i class="bi bi-calendar-week-fill">
                  </i>
                  ${date} ,
                  <i class="bi bi-clock">
                  </i>
                  ${time}
                </div>
              </a>
              <div class="othersComment">
                <p>
                  ${comment.commentContent}
                </p>
                <span>
                  <button onclick="commentLikeHandler(this)" data-tweet-id="${
                    tweet._id
                  }" data-comment-id="${index}">
                    ${
                      comment.likes.includes(loggedInUser._id)
                        ? `
                    <i class="bi bi-heart-fill">
                    </i>
                    `
                        : `
                    <i class="bi bi-heart">
                    </i>
                    `
                    } ${comment.likes.length}
                  </button>
                  ${
                    tweet.userId === user.userId
                      ? `
                  <button class="tweetDelete" data-tweet-id="${tweet._id}" data-comment-id="${index}"
                  onclick="commentDeleteHandler(this)" style="padding-left: 12px;">
                    <i class="bi bi-trash">
                    </i>
                  </button>
                  `
                      : comment.userId === user.userId
                      ? `
                  <button class="tweetDelete" data-tweet-id="${tweet._id}" data-comment-id="${index}"
                  onclick="commentDeleteHandler(this)" style="padding-left: 12px;">
                    <i class="bi bi-trash">
                    </i>
                  </button>
                  `
                      : ''
                  }
                </span>
              </div>
            </div>
            `;
                  })
                  .join('')}
          </div>
          <div class="userInfo" id="comment">
            <input type="text" id="commentInput_${index}" class="comment" placeholder="${
                  tweet.userId === user.userId
                    ? 'add a comment for yourself'
                    : `${'add a comment for ' + tweet.userNameAndFamilyName}`
                }">
            <button class="commentBtn" onclick='commentHandler(${index}, "${
                  tweet._id
                }")'>
              comment
            </button>
          </div>
        </div>
        `;
              })
              .join('')
      }`;
}

export default Tweets;
