// Component for predict Page
async function PredictPage() {
  const title = 'Predict | Football Media';
  document.title = title;

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

  let firstTeam = 'FcBarcelona';
  let secondTeam = 'Chelsea';
  window.predictionHandler = async function () {
    const firstTeamPrediction = document.getElementById('firstTeamPrediction');
    const secondTeamPrediction = document.getElementById(
      'secondTeamPrediction'
    );
    try {
      const res = await fetch(`http://localhost:3000/api/user/${user.userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          predictions: {
            firstTeam,
            secondTeam,
            firstTeamPrediction: firstTeamPrediction.value,
            secondTeamPrediction: secondTeamPrediction.value,
            predictionDate: Date.now(),
          },
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (res.status === 201) {
        alert('Prediction Submitted!');
        window.location.reload();
      } else {
        alert(data.message);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return `
<div class="container">
  <img class="imageContainer" draggable="false" src="../assets/images/footballGround.jpg"
  alt="footballGround" />
  <div class="content">
    <div class="upComingMatch">
      UpComing Match
    </div>
    <div class="teams">
      <img draggable="false" src="../assets/images/teamLogo/FcBarcelona.svg"
      alt="FcBarcelona" />
      <span>
        VS
      </span>
      <img draggable="false" src="../assets/images/teamLogo/Chelsea.svg" alt="Chelsea"
      />
    </div>
    ${
      userLogin
        ? `
    <div class="predictions">
      <div>
        <input value="0" min="0" max="20" type="number" id="firstTeamPrediction"
        />
        <input value="0" min="0" max="20" type="number" id="secondTeamPrediction"
        />
      </div>
      <button class="predictBtn" onclick="predictionHandler()">
        Predict
      </button>
    </div>
  </div>
  `
        : `
  <div class="upComingMatch">
    you must login before prediction!
  </div>
  `
    }
</div>`;
}

export default PredictPage;
