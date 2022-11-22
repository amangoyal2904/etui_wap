import { render } from "@testing-library/react";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
import DfpAds from "./DfpAds";

describe("DfpAds", () => {
  it("renders DfpAds", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <DfpAds adInfo={{ key: "atf" }} />
      </RouterContext.Provider>
    );
  });
});
