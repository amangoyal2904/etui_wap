import { render, screen } from "@testing-library/react";
import BreadCrumb from ".";
import { breadcrumb } from "testData/breadCrumbMockData";
describe("BreadCrumb", () => {
  it("render BreadCrumb", () => {
    render(<BreadCrumb data={breadcrumb} />);
  });

  it("items title and url are present", () => {
    render(<BreadCrumb data={breadcrumb} />);
    breadcrumb.forEach((data) => {
      expect(screen.getByText(data.title)).toBeInTheDocument();
      data?.url && expect(screen.getByRole("link", { name: data.title })).toHaveAttribute("href", data.url);
    });
  });
});
