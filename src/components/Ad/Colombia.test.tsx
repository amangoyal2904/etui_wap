import { render } from "@testing-library/react";
import Colombia from "./Colombia";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";

describe("Colombia", () => {
  it("renders Colombia", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Colombia />
      </RouterContext.Provider>
    );
  });
});
