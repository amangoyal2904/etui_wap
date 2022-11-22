import { render, screen } from "@testing-library/react";
import AppDownloadWidget from ".";

describe("AppDownloadWidget", () => {
  it("renders Text in AppDownloadWidget", () => {
    render(<AppDownloadWidget tpName="videoshow" />);
    expect(screen.getByText(/Our app has got more for you!/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse Quick Reads/i)).toBeInTheDocument();
    expect(screen.getByText(/Access ET Print Edition/i)).toBeInTheDocument();
    expect(screen.getByText(/Use Night Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/INSTALL ET APP/i)).toBeInTheDocument();
  });
  it("app download banner image is rendered correctly", () => {
    render(<AppDownloadWidget tpName="videoshow" />);
    const appDownloadBannerImage = screen.getByRole("img");
    expect(appDownloadBannerImage).toHaveAttribute("src", "https://img.etimg.com/photo/msid-92587267.cms");
    expect(appDownloadBannerImage).toHaveAttribute("alt", "app download banner");
  });
});
