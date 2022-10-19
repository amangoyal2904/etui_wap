import { screen, render } from "@testing-library/react";
import { otherVidsMockData } from "testData/otherVidsMockData";
import Listing from ".";

describe("Listing", () => {
  beforeEach(() => {
    render(
      <Listing type="grid" title={otherVidsMockData.title} data={otherVidsMockData} key={otherVidsMockData.name} />
    );
  });
  it("renders title correctly", () => {
    expect(screen.getByText(otherVidsMockData.title)).toBeInTheDocument();
  });
  it("paragraph rendering correctly", () => {
    otherVidsMockData.data.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });
});
