# Movie Store API

Welcome to the Movie Store API, a Node.js application that provides a comprehensive backend service for managing movie-related data. This API allows you to create, read, update, and delete movie records, as well as manage user authentication and authorization.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with the Movie Store API, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/RubaAlhasan/movie-store.git
   ```

2. Navigate to the project directory:
   ```bash
   cd movie-store
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To run the API locally, use the following command:
```bash
npm start
```

By default, the API will be accessible at `http://localhost:3000`.

## API Endpoints

### Movies

- **Get all movies**
  ```http
  GET /api/movies
  ```

- **Get a single movie**
  ```http
  GET /api/movies/:id
  ```

- **Create a new movie**
  ```http
  POST /api/movies
  ```

- **Update a movie**
  ```http
  PUT /api/movies/:id
  ```

- **Delete a movie**
  ```http
  DELETE /api/movies/:id
  ```

### Users

- **Register a new user**
  ```http
  POST /api/users/register
  ```

- **User login**
  ```http
  POST /api/users/login
  ```

- **Get user profile**
  ```http
  GET /api/users/profile
  ```

### Genres

- **Get all genres**
  ```http
  GET /api/genres
  ```

- **Get a single genre**
  ```http
  GET /api/genres/:id
  ```

- **Create a new genre**
  ```http
  POST /api/genres
  ```

- **Update a genre**
  ```http
  PUT /api/genres/:id
  ```

- **Delete a genre**
  ```http
  DELETE /api/genres/:id
  ```

### Reviews

- **Get all reviews for a movie**
  ```http
  GET /api/movies/:movieId/reviews
  ```

- **Create a new review for a movie**
  ```http
  POST /api/movies/:movieId/reviews
  ```

- **Update a review**
  ```http
  PUT /api/movies/:movieId/reviews/:reviewId
  ```

- **Delete a review**
  ```http
  DELETE /api/movies/:movieId/reviews/:reviewId
  ```

### Orders

- **Get all orders**
  ```http
  GET /api/orders
  ```

- **Get a single order**
  ```http
  GET /api/orders/:id
  ```

- **Create a new order**
  ```http
  POST /api/orders
  ```

- **Update an order**
  ```http
  PUT /api/orders/:id
  ```

- **Delete an order**
  ```http
  DELETE /api/orders/:id
  ```

## Environment Variables

The Movie Store API requires the following environment variables to function correctly. Create a `.env` file in the root directory and add the necessary variables:

```
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push your branch to your forked repository.
5. Create a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
