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
                pregameOddsHtml += [`<div>${odds.Sportsbook}: ${odds.HomePointSpread}</div>`,
                `<div>${odds.Sportsbook}: ${odds.AwayPointSpread}</div>`]
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

    oddsHtml += `<tr><td>America's Bookie</td><td>${odds.MoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>Bet365</td><td>${odds.Bet365MoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>Caesars</td><td>${odds.CaesarsMoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>FanDuel</td><td>${odds.FanDuelMoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.Under}) (${odds.UnderLine})</td></tr>`

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
    
//         oddsHtml += `<tr><td>America's Bookie</td><td>${odds.MoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>Bet365</td><td>${odds.Bet365MoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>Caesars</td><td>${odds.CaesarsMoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>FanDuel</td><td>${odds.FanDuelMoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.Under}) (${odds.UnderLine})</td></tr>`
    
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