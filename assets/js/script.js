const uselessFactEl = document.getElementById('uselessFact');
let uselessFact;
const inspirQuoteEl = document.getElementById('inspirQuote');
let newQuote;
const jokeModalEl = document.getElementById('jokeModal');
const jokeBtnEl = document.getElementById('jokeBtn');
const cancelBtnEl = document.getElementById('cancelBtn');
const submitEl = document.getElementById('jokeForm');
const dropdownEl = document.getElementById('dropdown');

function handleSubmit(event) {
    event.preventDefault();
    const selection = document.getElementById('dropdown').value;
    const errorMessageEl = document.getElementById('errorMessage');

    if (selection === 'noSelection') {
        errorMessageEl.textContent = '*Please make a selection.';
    } else {
        if (selection === 'riddle') {
            riddle();
        } else if (selection === 'randomJoke') {
            randomJoke();
        } else if (selection === 'dadJoke') {
            dadJoke();
        }
    }
}

function riddle(event) {
    // Clear local storage so only this result will display on results screen
    localStorage.clear();

    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/riddles',
        headers: { 'X-Api-Key': 'nNkzxsYKaz1ZMXgovIC5Hw==JugYXRd15s1J5cw5' },
        contentType: 'application/json',
        success: function (data) {
            if (!data || !data.length === 0) {
                console.log('No results returned');
                return;
            }
            const question = data[0].question;
            const answer = data[0].answer;
            const riddle = {
                question: question,
                answer: answer,
            };
            localStorage.setItem('selectedType', 'riddle');
            localStorage.setItem('riddle', JSON.stringify(data));
            // Redirect to a search-results page
            window.location.href = 'search-results.html';
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        },
    });
}

function randomJoke(event) {
    // Clear local storage so only this result will display on results screen
    localStorage.clear();

    fetch('https://official-joke-api.appspot.com/random_joke')
        .then(async (resp) => {
            let response = await resp.json();
            return response;
        })
        .then(function (data) {
            if (!data || !data.punchline) {
                console.log('No results returned');
                return;
            }

            let setup = data.setup;
            let punchline = data.punchline;
            const randomJoke = {
                setup: setup,
                punchline: punchline
            };

            localStorage.setItem('randomJoke', JSON.stringify(randomJoke));
            localStorage.setItem('selectedType', 'randomJoke');

            window.location.href = 'search-results.html';
            closeJokeModal();
        })
        .catch(function (error) {
            console.error('Error fetching random joke: ', error);
        });
}

function dadJoke(event) {
    // Clear local storage so only this result will display on results screen
    localStorage.clear();

    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/dadjokes',
        headers: { 'X-API-Key': 'bMihd37nmqvClWbzkx7xfQ==ibPk7EDF5byNpUhy' },
        contentType: 'application/json',
        success: function (data) {
            if (!data || !data.length === 0) {
                console.log('No results returned');
                return;
            }
            const dadJoke = data[0].joke;
            localStorage.setItem('selectedType', 'dadJoke');
            localStorage.setItem('dadJoke', JSON.stringify(dadJoke));
            // Redirect to a search-results page
            window.location.href = 'search-results.html';
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        },
    });

    closeJokeModal();
}

function openJokeModal(event) {
    event.preventDefault();
    jokeModalEl.classList.remove('hidden');
}

function closeJokeModal() {
    // Clear the form fields
    const form = document.querySelector('#dialog-form form');
    if (form) {
        form.reset();
    }
    jokeModalEl.classList.add('hidden');
}

// Function to handle the click on the useless facts card
function uselessFactClick(event) {
    event.preventDefault();

    // Clear local storage so only this result will display on results screen
    localStorage.clear();

    fetch('https://uselessfacts.jsph.pl/api/v2/facts/random')
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            if (!data || !data.text) {
                console.log('No results returned');
                return;
            }
            uselessFact = data.text;
            localStorage.setItem('selectedType', 'uselessFact');
            localStorage.setItem('uselessFact', JSON.stringify(data));
            // Redirect to a search-results page
            window.location.href = 'search-results.html';
        })
        .catch(function (error) {
            console.error('Error fetching random useless fact: ', error);
        });
}

async function getRandomQuote(event) {
    event.preventDefault();
    // Clear local storage so only this result will display on results screen
    localStorage.clear();

    const targetUrl = 'https://api.quotable.io/random';
    const resp = await fetch(targetUrl);
    const data = await resp.json();

    if (!data || !data.content) {
        console.log('No results returned');
        return;
    }
    newQuote = data.content;
    localStorage.setItem('selectedType', 'randomQuote');
    localStorage.setItem('randomQuote', JSON.stringify(data));
    // Redirect to a search-results page
    window.location.href = 'search-results.html';
}

dropdownEl.addEventListener('change', () => {
    const selection = dropdownEl.value;
    const errorMessageEl = document.getElementById('errorMessage');
    if (selection !== 'noSelection') {
        errorMessageEl.textContent = ''; // Clear the error message when a valid selection is made, even before submit is clicked
    }
});

uselessFactEl.addEventListener('click', uselessFactClick);
inspirQuoteEl.addEventListener('click', getRandomQuote);
jokeBtnEl.addEventListener('click', openJokeModal);
cancelBtnEl.addEventListener('click', closeJokeModal);
submitEl.addEventListener('submit', handleSubmit);
