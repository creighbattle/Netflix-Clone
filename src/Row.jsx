import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import movieTrailer from "movie-trailer";

import "./Row.css";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row(props) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [currentMovie, setCurrentMovie] = useState("");
  const [prevMovie, setPrevMovie] = useState("");
  const [alwaysRun, setAlwaysRun] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [noVideo, setNoVideo] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(props.fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [props.fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
      origin: "http://localhost:3000",
    },
  };

  useEffect(() => {
    //console.log(prevMovie);
    if (currentMovie === prevMovie) {
      setTrailerUrl("");
      setIsClicked(false);
    } else {
      movieTrailer(currentMovie || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          setIsClicked(false);
        })
        .catch((e) => failedFunction());
    }
  }, [currentMovie, alwaysRun, prevMovie]);

  const failedFunction = () => {
    setIsClicked(true);
    setTrailerUrl("");
  };

  const handleClick = (movie) => {
    setAlwaysRun(alwaysRun + 1);
    setPrevMovie(currentMovie);
    setCurrentMovie(movie.name ? movie.name : movie.title);
    setNoVideo(movie);
  };

  return (
    <div className="row">
      <h1>{props.title}</h1>

      <div className="row-posters">
        {movies
          .filter((movie) => movie.backdrop_path !== null)
          .map((movie) => (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row-poster ${props.isLargeRow && "row-posterLarge"} ${
                isClicked && "row-posterClicked"
              }`}
              src={`${base_url}${
                // props.isLargeRow ? movie.poster_path : movie.backdrop_path
                movie.poster_path
              }`}
              alt={movie.name}
            />
          ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      <div className="movie-overview">
        {isClicked && (
          <h1 className="movie-overview-text">{noVideo.overview}</h1>
        )}
      </div>
    </div>
  );
}

export default Row;
