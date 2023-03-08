const BASE_URL = 'https://api.sportsdata.io/v3/mlb/odds/json';

const API_KEY = 'a44d39bd28ae42ba864dde69392a0b1a';

const datePicker = document.querySelector('#datePicker');
const submitBtn = document.querySelector('#submitBtn');
const gameList = document.querySelector('#gameList');
const oddsTableBody = document.querySelector('#oddsTable tbody');



submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const selectedDate = datePicker.value;

    if (selectedDate) {
        const url = `${BASE_URL}/GameOddsByDate/${selectedDate}?key=${API_KEY}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                displayGames(data);
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        alert('Please select a date!');
    }
});


function displayGames(games) {
    let gameHtml = '';
    games.forEach((game, index) => {
        if (!game.GameID) {
            game.GameID = index;
        }

        // Define a variable to hold the pregame odds HTML
        let pregameOddsHtml = '';
        if (game.PregameOdds && game.PregameOdds.length > 0) {
            // Loop through the pregame odds and create HTML for each one
            game.PregameOdds.forEach(odds => {
                pregameOddsHtml += [`<div>${odds.Sportsbook}: ${odds.HomePointSpread}</div>
                <div>${odds.Sportsbook}: ${odds.AwayPointSpread}</div>`]
            });
        }

        gameHtml += `
        <li class="list-group-item" id="${game.GameID}">
          <div class="game-info">
            <div class="team-names">${game.HomeTeamName} vs ${game.AwayTeamName}</div>
            ${pregameOddsHtml}
          </div>
        </li>
      `;
    });
    gameList.innerHTML = gameHtml;

    gameList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const gameId = event.target.id;
            const game = games.find((game) => game.GameID == gameId);
            if (game) {
                displayOdds(game);
            } else {
                console.error('No game found with ID', gameId);
            }
        }
    });
}



function displayOdds(game) {
    if (!game) {
        console.error('No game selected.');
        return;
    }
    if (!game.PregameOdds || game.PregameOdds.length === 0) {
        console.error('No odds available for this game.');
        return;
    }

    const odds = game.PregameOdds[0];

    let oddsHtml = '';

    oddsHtml += `<tr><td>America's Bookie</td><td>${odds.AwayMoneyLine}</td><td>${odds.AwayPointSpread} (${odds.AwayPointSpreadPayout})</td><td>${odds.OverUnder} (${odds.OverPayout})</td></tr><tr><td>Bet365</td><td>${odds.AwayMoneyLine}</td><td>${odds.AwayPointSpread} (${odds.AwayPointSpreadPayout})</td><td>${odds.OverUnder} (${odds.OverPayout})</td></tr><tr><td>Caesars</td><td>${odds.AwayMoneyLine}</td><td>${odds.AwayPointSpread} (${odds.AwayPointSpreadPayout})</td><td>${odds.OverUnder} (${odds.OverPayout})</td></tr><tr><td>FanDuel</td><td>${odds.AwayMoneyLine}</td><td>${odds.AwayPointSpread} (${odds.AwayPointSpreadPayout})</td><td>${odds.OverUnder} (${odds.UnderPayout}) (${odds.OverPayout})</td></tr>`

    oddsTableBody.innerHTML = oddsHtml;
}
function showPregameOdds(gameId) {
    // Find the game element with the given gameId
    const gameElement = document.querySelector(`[data-game-id="${gameId}"]`);

    // Retrieve the pregame odds for the game
    const pregameOdds = gameData.find(game => game.GameId === gameId).PregameOdds;

    // Create an HTML element to display the pregame odds
    const pregameOddsElement = document.createElement('div');
    pregameOddsElement.classList.add('pregame-odds');

    // Loop through the pregame odds and create a display element for each one
    pregameOdds.forEach(odds => {
        const oddsElement = document.createElement('div');
        oddsElement.textContent = `${odds.Sportsbook}: ${odds.PointSpreadHome}`;
        pregameOddsElement.appendChild(oddsElement);
    });

    // Add the pregame odds element to the game element
    gameElement.appendChild(pregameOddsElement);
}


document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent form submission
    const numSelected = parseInt(document.getElementById('numGames').value);
    const selectedGames = selectRandomGames(games, numSelected);
    const selectedGamesList = document.getElementById('selectedGames');
    selectedGamesList.innerHTML = ''; // clear previous selected games
    
    for (let i = 0; i < selectedGames.length; i++) {
      const game = selectedGames[i];
      const gameElement = document.createElement('li');
      gameElement.innerText = `${game.awayTeam} @ ${game.homeTeam}`;
      selectedGamesList.appendChild(gameElement);
    }
  });
  
 // Function to select random games from the games array
function selectRandomGames(games, numSelected) {
  const selectedGames = [];
  for (let i = 0; i < numSelected; i++) {
    const randomIndex = Math.floor(Math.random() * games.length);
    selectedGames.push(games[randomIndex]);
    games.splice(randomIndex, 1);
  }
  return selectedGames;
}

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault(); // prevent form submission
  const numSelected = parseInt(document.getElementById('numGames').value);
  const selectedGames = selectRandomGames(games, numSelected);

  // Display selected games in the selectedGames column
  const selectedGamesList = document.getElementById('selectedGamesList');
  selectedGamesList.innerHTML = '';
  selectedGames.forEach(function(game) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = `${game.awayTeam} @ ${game.homeTeam}`;
    selectedGamesList.appendChild(listItem);
  });

  // Display odds for the first game in the odds table
  const oddsTableBody = document.querySelector('#oddsTable tbody');
  oddsTableBody.innerHTML = '';
  selectedGames[0].odds.forEach(function(odd) {
    const row = document.createElement('tr');
    const sportsbookCell = document.createElement('td');
    sportsbookCell.textContent = odd.sportsbook;
    const moneylineCell = document.createElement('td');
    moneylineCell.textContent = odd.moneyline;
    const pointSpreadCell = document.createElement('td');
    pointSpreadCell.textContent = odd.pointSpread;
    const totalCell = document.createElement('td');
    totalCell.textContent = odd.total;
    row.appendChild(sportsbookCell);
    row.appendChild(moneylineCell);
    row.appendChild(pointSpreadCell);
    row.appendChild(totalCell);
    oddsTableBody.appendChild(row);
  });
});




// const BASE_URL = 'https://api.sportsdata.io/v3/mlb/odds/json';

// const API_KEY = 'a44d39bd28ae42ba864dde69392a0b1a';

// const datePicker = document.querySelector('#datePicker');
// const submitBtn = document.querySelector('#submitBtn');
// const gameList = document.querySelector('#gameList');
// const oddsTableBody = document.querySelector('#oddsTable tbody');

// let gameData = null;

// submitBtn.addEventListener('click', (event) => {
//     event.preventDefault();
//     const selectedDate = datePicker.value;

//     if (selectedDate) {
//         const url = `${BASE_URL}/GameOddsByDate/${selectedDate}?key=${API_KEY}`;

//         fetch(url)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 gameData = data;
//                 displayGames(data);
//                 console.log(data);
//             })
//             .catch((error) => {
//                 console.error(error);
//             });
//     } else {
//         alert('Please select a date!');
//     }
// });

// function displayGames(games) {
//     let gameHtml = '';
  
//     games.forEach((game, index) => {
//       if (!game.GameID) {
//         game.GameID = index;
//       }
  
//       gameHtml += `
//         <li class="list-group-item" data-game-id="${game.GameID}">
//           <div class="game-info">
//             <div class="team-names">${game.HomeTeamName} vs ${game.AwayTeamName}</div>
//           </div>
//         </li>
//       `;
//     });
  
//     gameList.innerHTML = gameHtml;
  
//     gameList.addEventListener('click', (event) => {
//       if (event.target.tagName === 'LI') {
//         const gameId = event.target.dataset.gameId;
//         const game = games.find((game) => game.GameID == gameId);
//         if (game) {
//           showPregameOdds(gameId);
//         } else {
//           console.error('No game found with ID', gameId);
//         }
//       }
//     });
//   }
  
//   function displayOdds(game) {
//         if (!game) {
//             console.error('No game selected.');
//             return;
//         }
//         if (!game.PregameOdds || game.PregameOdds.length === 0) {
//             console.error('No odds available for this game.');
//             return;
//         }
    
//         const odds = game.PregameOdds[0];
    
//         let oddsHtml = '';
    
//         oddsHtml += `<tr><td>America's Bookie</td><td>${odds.MoneyLineAway}</td><td>${odds.AwayPointSpread} (${odds.AwayPointSpreadPayout})</td><td>${odds.OverUnder} (${odds.OverPayout})</td></tr><tr><td>Bet365</td><td>${odds.Bet365MoneyLineAway}</td><td>${odds.AwayPointSpread} (${odds.AwayPointSpreadPayout})</td><td>${odds.OverUnder} (${odds.OverPayout})</td></tr><tr><td>Caesars</td><td>${odds.CaesarsMoneyLineAway}</td><td>${odds.AwayPointSpread} (${odds.AwayPointSpreadPayout})</td><td>${odds.OverUnder} (${odds.OverPayout})</td></tr><tr><td>FanDuel</td><td>${odds.FanDuelMoneyLineAway}</td><td>${odds.AwayPointSpread} (${odds.AwayPointSpreadPayout})</td><td>${odds.OverUnder} (${odds.Under}) (${odds.OverPayout})</td></tr>`
    
//         oddsTableBody.innerHTML = oddsHtml;
//     }
//     function showPregameOdds(gameId) {
//         // Find the game element with the given gameId
//         const gameElement = document.querySelector(`[data-game-id="${gameId}"]`);
    
//         // Retrieve the pregame odds for the game
//         const pregameOdds = gameData.find(game => game.GameId === gameId).PregameOdds;
    
//         // Create an HTML element to display the pregame odds
//         const pregameOddsElement = document.createElement('div');
//         pregameOddsElement.classList.add('pregame-odds');
    
//         // Loop through the pregame odds and create a display element for each one
//         pregameOdds.forEach(odds => {
//             const oddsElement = document.createElement('div');
//             oddsElement.textContent = `${odds.Sportsbook}: ${odds.PointSpreadHome}`;
//             pregameOddsElement.appendChild(oddsElement);
//         });
    
//         // Add the pregame odds element to the game element
//         gameElement.appendChild(pregameOddsElement);
//     }