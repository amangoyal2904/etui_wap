import { getByText, render, screen } from "@testing-library/react";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
import Home from ".";

describe("Home Component", () => {
  it("renders a heading", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Home />
      </RouterContext.Provider>
    );

    expect(screen.getByRole("heading")).toBeTruthy();
  });
});
