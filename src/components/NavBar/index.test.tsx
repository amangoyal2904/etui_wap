import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "app/store";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
import NavBar from ".";

describe("NavBar", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <NavBar />
      </Provider>
    );
  });
  it("Renders NavBar", () => {
    const navigationBar = screen.queryByRole("navigation");
    expect(navigationBar).toBeNull();
  });
});
