// App.test.jsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Pagination Component", () => {

  test("renders welcome text and first page products", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        total: 20,
        products: [
          { id: 1, title: "iPhone" },
          { id: 2, title: "Samsung" },
        ],
      }),
    });

    render(<App />);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(await screen.findByText("iPhone")).toBeInTheDocument();
    expect(screen.getByText("Samsung")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products?skip=0&limit=10"
    );
  });



  test("Previous button is disabled on first page", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        total: 20,
        products: [],
      }),
    });

    render(<App />);

    const previousButton = await screen.findByRole("button", {
      name: /previous/i,
    });

    expect(previousButton).toBeDisabled();
  });

  

  test("clicking Next loads second page", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 20,
          products: [{ id: 1, title: "Page 1 Product" }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 20,
          products: [{ id: 2, title: "Page 2 Product" }],
        }),
      });

    render(<App />);

    expect(await screen.findByText("Page 1 Product")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /next/i })
    );

    expect(await screen.findByText("Page 2 Product")).toBeInTheDocument();

    expect(fetch).toHaveBeenLastCalledWith(
      "https://dummyjson.com/products?skip=10&limit=10"
    );
  });

  test("clicking Previous returns to first page", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 20,
          products: [{ id: 1, title: "Page 1 Product" }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 20,
          products: [{ id: 2, title: "Page 2 Product" }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 20,
          products: [{ id: 1, title: "Page 1 Product" }],
        }),
      });

    render(<App />);

    expect(await screen.findByText("Page 1 Product")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /next/i })
    );

    expect(await screen.findByText("Page 2 Product")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /previous/i })
    );

    expect(await screen.findByText("Page 1 Product")).toBeInTheDocument();
  });

  test("updates current page number", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 20,
          products: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 20,
          products: [],
        }),
      });

    render(<App />);

    expect(await screen.findByText("1 of 2")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /next/i })
    );

    expect(await screen.findByText("2 of 2")).toBeInTheDocument();
  });

  test("handles API failure", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    fetch.mockResolvedValue({
    ok: false,
    });


    render(<App />);

    expect(await screen.findByText("Welcome")).toBeInTheDocument();

    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

});