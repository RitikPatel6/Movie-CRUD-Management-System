import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/api/movies";

function App() {
  const [movies, setMovies] = useState([]);

  const [movie, setMovie] = useState({
    movie_name: "",
    actor_name: "",
    actress_name: "",
    release_date: "",
    director_name: "",
    producer_name: "",
  });

  const [editId, setEditId] = useState(null);

  // Get all movies
  const getMovies = async () => {
    const res = await axios.get(API_URL);
    setMovies(res.data);
  };

  useEffect(() => {
    getMovies();
  }, []);

  // Input change
  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  // Add or Update movie
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !movie.movie_name ||
      !movie.actor_name ||
      !movie.actress_name ||
      !movie.release_date ||
      !movie.director_name ||
      !movie.producer_name
    ) {
      alert("All fields are required");
      return;
    }

    if (editId === null) {
      await axios.post(API_URL, movie);
      alert("Movie added successfully");
    } else {
      await axios.put(`${API_URL}/${editId}`, movie);
      alert("Movie updated successfully");
    }

    setMovie({
      movie_name: "",
      actor_name: "",
      actress_name: "",
      release_date: "",
      director_name: "",
      producer_name: "",
    });

    setEditId(null);
    getMovies();
  };

  // Edit movie
  const editMovie = (m) => {
    setEditId(m.id);

    setMovie({
      movie_name: m.movie_name,
      actor_name: m.actor_name,
      actress_name: m.actress_name,
      release_date: m.release_date?.split("T")[0],
      director_name: m.director_name,
      producer_name: m.producer_name,
    });
  };

  // Delete movie
  const deleteMovie = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name} movie?`)) {
      return;
    }

    await axios.delete(`${API_URL}/${id}`);
    alert("Movie deleted successfully");
    getMovies();
  };

  return (
    <div className="container">
      <h1>Movie CRUD Management System</h1>

      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Movie Name:</label>
              <input
                type="text"
                name="movie_name"
                value={movie.movie_name}
                onChange={handleChange}
                placeholder="Enter movie name"
              />
            </div>

            <div className="form-group">
              <label>Actor Name:</label>
              <input
                type="text"
                name="actor_name"
                value={movie.actor_name}
                onChange={handleChange}
                placeholder="Enter actor name"
              />
            </div>

            <div className="form-group">
              <label>Actress Name:</label>
              <input
                type="text"
                name="actress_name"
                value={movie.actress_name}
                onChange={handleChange}
                placeholder="Enter actress name"
              />
            </div>

            <div className="form-group">
              <label>Release Date:</label>
              <input
                type="date"
                name="release_date"
                value={movie.release_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Director Name:</label>
              <input
                type="text"
                name="director_name"
                value={movie.director_name}
                onChange={handleChange}
                placeholder="Enter director name"
              />
            </div>

            <div className="form-group">
              <label>Producer Name:</label>
              <input
                type="text"
                name="producer_name"
                value={movie.producer_name}
                onChange={handleChange}
                placeholder="Enter producer name"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {editId === null ? "Add Movie" : "Update Movie"}
          </button>
        </form>
      </div>

      <div className="table-box">
        <h2>Available Movies</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Movie Name</th>
              <th>Actor</th>
              <th>Actress</th>
              <th>Release Date</th>
              <th>Director</th>
              <th>Producer</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {movies.length === 0 ? (
              <tr>
                <td colSpan={8}>No movies available</td>
              </tr>
            ) : (
              movies.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.movie_name}</td>
                  <td>{m.actor_name}</td>
                  <td>{m.actress_name}</td>
                  <td>{m.release_date?.split("T")[0]}</td>
                  <td>{m.director_name}</td>
                  <td>{m.producer_name}</td>
                  <td>
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => editMovie(m)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteMovie(m.id, m.movie_name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;