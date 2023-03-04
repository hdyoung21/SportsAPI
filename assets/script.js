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
    games.forEach((game) => {
        gameHtml += `<li class="list-group-item" id="${game.GameID}">${game.HomeTeam} vs ${game.AwayTeam}</li>`;
    });
    gameList.innerHTML = gameHtml;
    gameList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const gameId = event.target.id;
            const game = games.find((game) => game.GameID === gameId);

            displayOdds(game);
        }
    });
}

function displayOdds(game) {
    const odds = game.GameOdds[0];

    let oddsHtml = '';

oddsHtml += `<tr><td>America's Bookie</td><td>${odds.MoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>Bet365</td><td>${odds.Bet365MoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>Caesars</td><td>${odds.CaesarsMoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.UnderLine})</td></tr><tr><td>FanDuel</td><td>${odds.FanDuelMoneyLineAway}</td><td>${odds.PointSpreadAway} (${odds.PointSpreadAwayMoney})</td><td>${odds.TotalNumber} (${odds.Under}) (${odds.UnderLine})</td></tr>`};
