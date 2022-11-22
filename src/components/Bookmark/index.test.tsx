import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "app/store";

import Bookmark from ".";

interface BookmarkProps {
  msid: string;
  hostId: string;
  type: string;
}
it("renders Bookmark Component", () => {
  const shareParam: BookmarkProps = {
    msid: "",
    hostId: "",
    type: ""
  };
  render(
    <Provider store={store}>
      <Bookmark {...shareParam} />
    </Provider>
  );
});
