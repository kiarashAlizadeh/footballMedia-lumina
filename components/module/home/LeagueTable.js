// LeagueTable Component
async function LeagueTable() {
  const footballLeagueList = [
    { teamName: 'Eagle Warriors', points: 45, goals: 38 },
    { teamName: 'Storm Breakers', points: 42, goals: 35 },
    { teamName: 'Thunder Strikers', points: 50, goals: 41 },
    { teamName: 'Shadow Hunters', points: 39, goals: 30 },
    { teamName: 'Iron Titans', points: 47, goals: 40 },
    { teamName: 'Crimson Hawks', points: 44, goals: 37 },
    { teamName: 'Frozen Blades', points: 35, goals: 28 },
    { teamName: 'Golden Panthers', points: 48, goals: 42 },
    { teamName: 'Venom Spikes', points: 40, goals: 33 },
    { teamName: 'Dark Phantoms', points: 38, goals: 29 },
    { teamName: 'Solar Knights', points: 46, goals: 39 },
    { teamName: 'Blazing Dragons', points: 41, goals: 34 },
    { teamName: 'Steel Wolves', points: 49, goals: 43 },
    { teamName: 'Mystic Falcons', points: 37, goals: 31 },
    { teamName: 'Inferno Sharks', points: 43, goals: 36 },
    { teamName: 'Neon Tigers', points: 36, goals: 27 },
    { teamName: 'Shadow Serpents', points: 34, goals: 26 },
    { teamName: 'Storm Hawks', points: 51, goals: 44 },
    { teamName: 'Arctic Foxes', points: 33, goals: 25 },
    { teamName: 'Tornado Riders', points: 32, goals: 24 },
  ];

  return `<!-- Add the title for the chart -->
    <div class="title">
      England Football League
      <span>
        2025
        <img src="../assets/images/FootballMediaLogo.png" alt="" />
      </span>
    </div>
    <!-- Add the table for the chart -->
    <table class="table">
      <!-- Add the table header row -->
      <tr>
        <th class="th">
          Number
        </th>
        <th class="th">
          Team
        </th>
        <th class="th">
          Points
        </th>
        <th class="th">
          Goals
        </th>
      </tr>
      <!-- Add the table data rows -->
      <!-- Use some static data for the example -->
      ${footballLeagueList
        .map((item, index) => {
          return `
      <tr>
        <td class="td">
          ${index + 1}
        </td>
        <td class="td">
          ${item.teamName}
        </td>
        <td class="td">
          ${item.points}
        </td>
        <td class="td">
          ${item.goals}
        </td>
      </tr>
      `;
        })
        .join('')}
    </table>`;
}

export default LeagueTable;
