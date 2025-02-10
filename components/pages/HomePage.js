import Weather from '../module/home/Weather.js';
import LeagueTable from '../module/home/LeagueTable.js';
import Tweets from '../module/Tweets.js';

// Component for Home Page
async function HomePage() {
  const title = 'Home | Football Media';
  document.title = title;

  let userLogin;
  async function fetchContent() {
    try {
      // get loggedInUser
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
    } catch (err) {
      console.log('error in home page: ', err);
    }
  }
  await fetchContent();


  return `
<div class="banner">
  <img src="../assets/images/twitterHeader.jpg" alt="twitterHeader" />
</div>
<div class="container">
  <div class="left-sidebar">
    ${await LeagueTable()}
  </div>
  <div class="tweetSection">
    ${await Tweets('ALL')}
  </div>
  <div class="right-sidebar">
     ${await Weather()}
  </div>
</div>`;
}

export default HomePage;
