const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const movieDetails = document.getElementById('movieDetails');

searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('input', debounce(searchMovies, 300));
let allMovies = []; // Store all movies data


function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

async function searchMovies() {
    const query = searchInput.value.trim();
    if (query === '') {
        searchResults.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=1802e537`); //Connecting to api
        const data = await response.json();
        allMovies = data.Search || [];
        displaySearchResults(filterMovies(query));
    } catch (error) {
        console.error('Error:', error);
    }
}

// Filtering Movie Data

function filterMovies(query) {
    return allMovies.filter(movie => {
        const title = movie.Title.toLowerCase();
        return title.includes(query.toLowerCase());
    });
}

// Search Movie Data
function displaySearchResults(results) {
    if (!results || results.length === 0) {
        searchResults.innerHTML = 'No results found.';
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};

    const html = results.map(movie => {
        const isFavorite = favorites[movie.imdbID]; // Check if the movie is a favorite

        return `
        <div class="movie-result" data-movie-id="${movie.imdbID}">
            <img src="${movie.Poster}" alt="${movie.Title}">
            <div class='movieContainer'>
            <div class='title'>${movie.Title}</div>
            <p> <i class="fa-solid fa-calendar-days"></i> Release Year: ${movie.Year}</p>
            <button class="favorite-button ${isFavorite ? 'remove-favorite favorite' : ''}">
                ${isFavorite ? 'Remove Favorite' : 'Add Favorite'}
            </button>
            </div>
        </div>
        `;
    }).join('');

    searchResults.innerHTML = html;
}

// Add an event listener to handle clicks on search results (suggestions)
searchResults.addEventListener('click', function(event) {
    const movieResult = event.target.closest('.movie-result');
    if (movieResult) {
        const movieId = movieResult.dataset.movieId;
        // Check if the clicked element is not the "Favorite" button
        if (!event.target.classList.contains('favorite-button')) {
            // Redirect to the movie details page with the IMDb ID as a query parameter
            window.location.href = `movie.html?imdbID=${movieId}`;
        }
        if (event.target.classList.contains('favorite-button')) {
            const button = event.target;
            const movieResult = button.closest('.movie-result');
            const movieId = movieResult.getAttribute('data-movie-id'); // Get the IMDb ID from the attribute
            toggleFavorite(button, movieId); // Pass the IMDb ID to the toggleFavorite function
        }
    }
});

// Function to toggle favorite and save/remove the movie
function toggleFavorite(button, movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || {};

    if (button.classList.contains('favorite')) {
        button.textContent = 'Add Favorite';
        button.classList.remove('remove-favorite');
        button.classList.remove('favorite');
        // Remove the movie from the favorites
        delete favorites[movieId];
    } else {
        button.textContent = 'Remove Favorite';
        button.classList.add('remove-favorite');
        button.classList.add('favorite');
        // Add the movie as a favorite
        favorites[movieId] = true;
    }

    // Store the updated favorites in localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

