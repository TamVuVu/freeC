import apiService from "../App/apiService";
import {
  Error,
  IResponseError,
  IResponseMovieDetailsSuccess,
  IResponseMoviesSuccess,
} from "../types";

export const apiGetMovies = async (
  path: string
): Promise<IResponseMoviesSuccess | IResponseError> => {
  try {
    const movies = (await apiService.get(path))?.data;
    return movies;
  } catch (error) {
    const err = error as Error;
    return {
      Response: "False",
      Error: err.message ? err.message : "Something went wrong",
    };
  }
};

export const apiGetMovieDetails = async (
  path: string
): Promise<IResponseMovieDetailsSuccess | IResponseError> => {
  try {
    const movieDetails = (await apiService.get(path))?.data;
    if (movieDetails?.Response !== "False") {
      return {
        Response: "True",
        movie: movieDetails,
      };
    } else {
      return movieDetails;
    }
  } catch (error) {
    const err = error as Error;
    return {
      Response: "False",
      Error: err.message ? err.message : "Something went wrong",
    };
  }
};
