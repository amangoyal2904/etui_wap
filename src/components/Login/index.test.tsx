import { render, screen, act, cleanup, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import { Provider } from "react-redux";
import { APP_ENV } from "../../utils";
import Login from ".";
import React from "react";
import APIS_CONFIG from "network/config.json";
import { store } from "app/store";

describe("AddText Component", () => {
  afterEach(cleanup);
  test("renders learn react link", () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const linkElement = screen.getByText(/Sign/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("don't render prime user logo img tag incase of free user", () => {
    const { queryByTestId } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const imgTag = queryByTestId("primeUserLogo"); // checks for nodes those are not rendered

    expect(imgTag).toBeFalsy();
  });

  it("redirect on sign in click", async () => {
    await act(async () => {
      const { queryByTestId, getByTestId } = render(
        <Provider store={store}>
          <Login />
        </Provider>
      );
      const loginBaseUrl = APIS_CONFIG.LOGIN[APP_ENV];
      const loginUrl = `${loginBaseUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`;

      const signInbutton = screen.getByText("Sign In");
      const assignMock = jest.fn();
      delete window.location;
      window.location = { assign: assignMock as any } as Location;
      await fireEvent.click(signInbutton);

      setTimeout(() => {
        expect(window.location.href).toBe(loginUrl);
        afterEach(() => {
          assignMock.mockClear();
        });
      }, 1000);
    });
  });
});
function makeStore() {
  throw new Error("Function not implemented.");
}
