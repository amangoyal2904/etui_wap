import { render, screen } from "@testing-library/react";
import Footer from ".";
import { Provider } from "react-redux";
import { store } from "app/store";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";

describe("Footer", () => {
  it("renders footer link", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Provider store={store}>
          <Footer />
        </Provider>
      </RouterContext.Provider>
    );
    expect(screen.getByText("download et app")).toBeInTheDocument();
    expect(screen.getByText("follow us on")).toBeInTheDocument();
    expect(screen.getByText("Terms of Use & Grievance Redressal Policy")).toBeInTheDocument();
    expect(screen.getByText("DNPA Code of Ethics")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });
});
