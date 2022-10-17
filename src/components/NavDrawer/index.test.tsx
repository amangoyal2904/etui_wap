import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "app/store";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
import NavDrawer from ".";

describe("NavDrawer", () => {
  it("NavDrawer is not opened", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Provider store={store}>
          <NavDrawer isOpen={false} setIsDrawerOpen={jest.fn()} />
        </Provider>
      </RouterContext.Provider>
    );
  });

  it("NavDrawer is opened", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Provider store={store}>
          <NavDrawer isOpen={true} setIsDrawerOpen={jest.fn()} />
        </Provider>
      </RouterContext.Provider>
    );
  });
});
