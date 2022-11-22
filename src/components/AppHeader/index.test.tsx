import { render, screen } from "@testing-library/react";
import AppHeader from ".";
import { Provider } from "react-redux";
import { store } from "app/store";
import { ET_WAP_URL } from "utils/common";
describe("Home", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <AppHeader />
      </Provider>
    );
  });
  it("renders a heading", () => {
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  it("App header image has correct link", () => {
    expect(screen.getByRole("link")).toHaveAttribute("href", ET_WAP_URL);
  });
});
