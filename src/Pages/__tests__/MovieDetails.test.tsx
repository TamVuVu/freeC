import { render, screen, waitFor } from "@testing-library/react";
import { apiGetMovieDetails } from "../../Api";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { MoviesDetails } from "../MovieDetails";

jest.mock("../../Api/index.ts");

describe("Test page MovieDetails", () => {
  const oldEnv = process.env;
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...oldEnv }; // Make a copy
  });
  it("Render MoviesDetails", async () => {
    process.env.REACT_APP_API_KEY = "fake_api_key";
    (apiGetMovieDetails as jest.Mock).mockResolvedValue({
      Response: "True",
      movie: { imdbID: "1", Title: "Gao", Type: "movie", Year: 1996 },
    });
    render(
      <BrowserRouter>
        <MoviesDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Gao - 1996")).toBeInTheDocument();
    });
  });

  it("should return not found text when not found movie", async () => {
    (apiGetMovieDetails as jest.Mock).mockResolvedValue({
      Response: "False",
      Error: "Movie not found",
    });
    render(
      <BrowserRouter>
        <MoviesDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Movie not found")).toBeInTheDocument();
    });
  });

  afterAll(() => {
    process.env = oldEnv; // Restore old environment
  });
});
