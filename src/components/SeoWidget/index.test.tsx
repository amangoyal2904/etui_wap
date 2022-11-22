import { render, screen } from "@testing-library/react";
import { result } from "testData/seoWidgetTestResultData";
import SeoWidget from ".";

describe("render SeoWidget correctly", () => {
  beforeEach(() => {
    render(<SeoWidget data={result.relKeywords} title="READ MORE" />);
  });

  it("contains READ MORE or  TOP TRENDING TERMS", () => {
    expect(screen.getByText(/read more/i)).toBeInTheDocument();
  });

  it("constains data title and data url in SeoWidget", () => {
    result.relKeywords.forEach((data) => {
      expect(screen.getByText(data.title)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: data.title })).toHaveAttribute("href", data.url);
    });
  });
});
