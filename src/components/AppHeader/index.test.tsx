import { render, screen } from "@testing-library/react";
import AppHeader from ".";
import { Provider } from "react-redux";
import { store } from "app/store";

describe("Home", () => {
  it("renders a heading", () => {
    render(
      <Provider store={store}>
        <AppHeader />
      </Provider>
    );

    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });
});
