// movie.js

// Get the IMDb ID from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('imdbID');
const favorites = JSON.parse(localStorage.getItem('favorites')) || {};

if (imdbID) {
    console.log(imdbID)
    // Fetch movie details using the IMDb ID
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=1802e537`)
        .then(response => response.json())
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
} else {
    // Handle the case where IMDb ID is not provided
    const movieDetails = document.getElementById('movieDetails');
    movieDetails.innerHTML = 'No movie selected.';
}

function displayMovieDetails(movie) {
    let isFavorite = favorites[movie.imdbID];
    const movieDetails = document.getElementById('movieDetails');
    const html = `
        <div class="movie-details">
        <h2>${movie.Title}</h2>
        <div class="display_flex"> 
        <div>    
        <img src="${movie.Poster}" alt="${movie.Title}">
            <button class="favorite-button ${isFavorite ? 'remove-favorite' : ''}" data-movie-id="${movie.imdbID}">
                        ${isFavorite ? 'Remove Favorite' : 'Add Favorite'}
            </button>
        </div>
            <div class="Movie-Content">
            
            <p><i class="fa-solid fa-calendar-days"></i>  Release Year: ${movie.Year}</p>
            <p> <h4><i class="fa-solid fa-user"></i>  Actors:</h4> ${movie.Actors}</p
            <p> <h4><i class="fa-solid fa-tag"></i>  Genre:</h4> ${movie.Genre}</p>
            <p> <h4><i class="fa-solid fa-clapperboard"></i>  Director:</h4> ${movie.Director}</p>
            <p>     <i class="fa-brands fa-imdb"></i>  IMDB:  ${movie.imdbRating} </p>
            <p>     <i class="fa-brands fa-meta"></i> Metacritic:  ${movie.Ratings[1].Value} </p>
                </div>
            <div id="plot">
            <h3> Plot Summary </h3>
            <p id= 'plot'>${movie.Plot}</p>
            </div>
            
            </div>
            
        </div>
    `;
    
    movieDetails.innerHTML = html;

    // Add event listener to the "Favorite" button
    const favoriteButton = movieDetails.querySelector('.favorite-button');
    favoriteButton.addEventListener('click', function () {
        const movieId = this.getAttribute('data-movie-id');
        
        if (isFavorite) {
            // Remove the movie from favorites and update localStorage
            delete favorites[movieId];
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } else {
            // Add the movie to favorites and update localStorage
            favorites[movieId] = true;
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }

        // Toggle the "Add Favorite" and "Remove Favorite" text and class
        isFavorite = !isFavorite;
        this.textContent = isFavorite ? 'Remove Favorite' : 'Add Favorite';
        this.classList.toggle('remove-favorite');
    });
}