import { Home } from "../Home";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { apiGetMovies } from "../../Api";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

jest.mock("../../Api/index.ts");

describe("Test page Home", () => {
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
  it("Render Home", async () => {
    process.env.REACT_APP_API_KEY = "fake_api_key";
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    (apiGetMovies as jest.Mock).mockResolvedValue({
      Response: "True",
      Search: [{ imdbID: "1", Title: "Gao", Type: "movie", Year: 1996 }],
      totalResults: 1,
    });
    fireEvent.change(screen.getByPlaceholderText("Enter movie name"), {
      target: { value: "gao" },
    });
    fireEvent.click(screen.getByRole("button"));

    expect(apiGetMovies).toBeCalledWith("/?s=gao&page=1&apikey=fake_api_key");
    await waitFor(() => {
      expect(screen.getByText("Result for: gao")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Gao")).toBeInTheDocument();
    });
  });

  it("should return right filtered movies when select filter type", async () => {
    process.env.REACT_APP_API_KEY = "fake_api_key";
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    (apiGetMovies as jest.Mock).mockResolvedValue({
      Response: "True",
      Search: [{ imdbID: "1", Title: "Gao", Type: "movie", Year: 1996 }],
      totalResults: 1,
    });
    fireEvent.change(screen.getByPlaceholderText("Enter movie name"), {
      target: { value: "gao" },
    });

    userEvent.click(screen.getByRole("combobox"));
    await waitFor(() => screen.findByText("Movie"));
    fireEvent.click(await screen.findByText("Movie"));
    fireEvent.click(screen.getByRole("button"));
    expect(apiGetMovies).toBeCalledWith(
      "/?s=gao&type=movie&page=1&apikey=fake_api_key"
    );
    await waitFor(() => {
      expect(screen.getByText("Result for: gao")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Gao")).toBeInTheDocument();
    });
  });

  it("should return movie not found when no movie found", async () => {
    process.env.REACT_APP_API_KEY = "fake_api_key";
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    (apiGetMovies as jest.Mock).mockResolvedValue({
      Response: "False",
      Error: "Movie not found",
    });
    fireEvent.change(screen.getByPlaceholderText("Enter movie name"), {
      target: { value: "not-found-movie" },
    });

    fireEvent.click(screen.getByRole("button"));
    expect(apiGetMovies).toBeCalledWith(
      "/?s=not-found-movie&page=1&apikey=fake_api_key"
    );
    await waitFor(() => {
      expect(screen.getByText("Movie not found")).toBeInTheDocument();
    });
  });

  afterAll(() => {
    process.env = oldEnv; // Restore old environment
  });
});
