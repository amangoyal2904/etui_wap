import { getByText, render, screen } from "@testing-library/react";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
// import VideoShow from ".";
// import { data } from 'testData/videoshow';
import Home from "../Home";

describe("VideoShow Component", () => {
  it("renders a heading", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        {/* <VideoShow data={{...data}} /> */}
        <Home />
      </RouterContext.Provider>
    );

    expect(screen.getByRole("heading")).toBeTruthy();
  });
});
