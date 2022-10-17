import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "app/store";
import SocialShare from ".";

describe("render SocialShare", () => {
  it("it has Share this video title", () => {
    render(
      <Provider store={store}>
        <SocialShare
          shareParam={{
            shareUrl: "",
            title: "",
            msid: "",
            hostId: "",
            type: ""
          }}
        />
      </Provider>
    );
    expect(screen.getByText("Share this Video")).toBeInTheDocument();
  });
});
