import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/api/movies";

function App() {
  const [movie, setMovie] = useState({
    movie_name: "",
    actor_name: "",
    actress_name: "",
    release_date: "",
    director_name: "",
    producer_name: "",
  });

  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const getMovies = async () => {
    try {
      const res = await axios.get(API_URL);
      setMovies(res.data);
      setError("");
    } catch (err) {
      setError("Backend server is not running or database connection failed");
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleChange = (e: any) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setMovie({
      movie_name: "",
      actor_name: "",
      actress_name: "",
      release_date: "",
      director_name: "",
      producer_name: "",
    });

    setEditId(null);
  };

  const formatDate = (dateValue: string) => {
    if (!dateValue) return "";

    return dateValue.split("T")[0];
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !movie.movie_name ||
      !movie.actor_name ||
      !movie.actress_name ||
      !movie.release_date ||
      !movie.director_name ||
      !movie.producer_name
    ) {
      setError("All fields are required");
      return;
    }

    try {
      if (editId === null) {
        await axios.post(API_URL, movie);
        alert("Movie added successfully");
      } else {
        await axios.put(`${API_URL}/${editId}`, movie);
        alert("Movie updated successfully");
      }

      clearForm();
      getMovies();
      setError("");
    } catch (err) {
      setError("Movie not saved. Please check backend.");
    }
  };

  const handleEdit = (m: any) => {
    setEditId(m.id);

    setMovie({
      movie_name: m.movie_name,
      actor_name: m.actor_name,
      actress_name: m.actress_name,
      release_date: formatDate(m.release_date),
      director_name: m.director_name,
      producer_name: m.producer_name,
    });
  };

  const handleDelete = async (id: number, movieName: string) => {
    if (!confirm(`Are you sure you want to delete ${movieName} movie?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies(movies.filter((m) => m.id !== id));
      alert("Movie deleted successfully");
    } catch (err) {
      setError("Movie not deleted. Please check backend.");
    }
  };

  return (
    <div className="container">
      <h1>Movie CRUD Management System</h1>

      <div className="form-box">
        {/* <h2>{editId === null ? "Add Movie" : "Edit Movie"}</h2> */}

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Movie Name:</label>
              <input
                type="text"
                name="movie_name"
                placeholder="Enter movie name"
                value={movie.movie_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Actor Name:</label>
              <input
                type="text"
                name="actor_name"
                placeholder="Enter actor name"
                value={movie.actor_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Actress Name:</label>
              <input
                type="text"
                name="actress_name"
                placeholder="Enter actress name"
                value={movie.actress_name}
                onChange={handleChange}
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
                placeholder="Enter director name"
                value={movie.director_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Producer Name:</label>
              <input
                type="text"
                name="producer_name"
                placeholder="Enter producer name"
                value={movie.producer_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button-row">
            <button type="submit" className="submit-btn">
              {editId === null ? "Submit Movie" : "Update Movie"}
            </button>

            {editId !== null && (
              <button type="button" className="cancel-btn" onClick={clearForm}>
                Cancel Edit
              </button>
            )}
          </div>
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
                  <td>{formatDate(m.release_date)}</td>
                  <td>{m.director_name}</td>
                  <td>{m.producer_name}</td>
                  <td>
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => handleEdit(m)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(m.id, m.movie_name)}
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