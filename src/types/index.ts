export interface IMovie {
  imdbID: string;
  Title: string;
  Year: boolean;
  Type: string;
  Poster: string;
  Plot?: string;
}

export interface IConfigReducer {
  isLoading: boolean;
  errorMessage: string;
}

export interface Error {
  message?: string;
}
export type ChildrenProps = {
  children: string | JSX.Element | JSX.Element[];
};

export type FilterOptions = {
  s?: string;
  page?: string;
  type?: string;
};

export interface IResponse {
  Response: "True" | "False";
}

export interface IResponseSuccess extends IResponse {
  Response: "True";
}

export interface IResponseMoviesSuccess extends IResponseSuccess {
  Search: IMovie[];
  totalResults: number;
}
export interface IResponseMovieDetailsSuccess extends IResponseSuccess {
  movie: IMovie;
}

export interface IResponseError extends IResponse {
  Response: "False";
  Error: string;
}
