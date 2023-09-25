// Function to display favorite movies on the page
function displayFavoriteMovies() {
    const favoriteMoviesContainer = document.getElementById('favoriteMovies');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};

    // Check if there are any favorite movies
    if (Object.keys(favorites).length === 0) {
        favoriteMoviesContainer.innerHTML = '<p>No favorite movies added yet.</p>';
        return;
    }

    // Loop through the favorite movies and display them
    for (const movieId in favorites) {
        if (favorites.hasOwnProperty(movieId)) {
            fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=1802e537`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.Response === 'True') {
                        const movieCard = document.createElement('div');
                        movieCard.classList.add('movie-result');
                        movieCard.innerHTML = `
                        <div data-movie-id="${data.imdbID}">
                        <img src="${data.Poster}" alt="${data.Title}">
                        <div class='movieContainer'>
                        <div class='movie-title'>${data.Title}</div>
                        <p><i class="fa-solid fa-calendar-days"></i> Release Year: ${data.Year}</p>
                        <button class="remove-favorite-button" data-movie-id="${data.imdbID}">Remove Favorite</button>
                        </div>
                        </div>
        
                        `;
                        favoriteMoviesContainer.appendChild(movieCard);

                        movieCard.addEventListener('click', function (event) {
                            // Check if the clicked element is not the "Remove Favorite" button
                            if (!event.target.classList.contains('remove-favorite-button')) {
                                // Get the IMDb ID from the button's data attribute
                                const movieIdToRedirect = data.imdbID;

                                // Redirect to the movie.html page with the IMDb ID as a query parameter
                                window.location.href = `movie.html?imdbID=${movieIdToRedirect}`;
                            }
                        });

                        // Add event listener to remove favorite
                        const removeFavoriteButton = movieCard.querySelector('.remove-favorite-button');
                        removeFavoriteButton.addEventListener('click', function () {
                            // Get the IMDb ID from the button's data attribute
                            const movieIdToRemove = data.imdbID;

                            // Remove the movie from favorites and update localStorage
                            delete favorites[movieIdToRemove];
                            localStorage.setItem('favorites', JSON.stringify(favorites));

                            // Remove the movie card from the page
                            movieCard.remove();
                        });

                        favoriteMoviesContainer.appendChild(movieCard);
                    } else {
                        // Handle error
                        console.error('Error fetching favorite movie details:', data.Error);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching favorite movie details:', error);
                });
        }
    }
}

// Call the function to display favorite movies when the page loads
displayFavoriteMovies();




