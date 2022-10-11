import { getByText, render, screen } from "@testing-library/react";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
import Topic from ".";
import { data } from "testData/topic";
import { Provider } from "react-redux";
import { store } from "app/store";

jest.mock(
    "next/image",
    () =>
        function Image({ src, alt }) {
            return <img src={src} alt={alt} />;
        }
);

describe("topic Component", () => {
    it("renders a heading", () => {
        render(
            <RouterContext.Provider value={createMockRouter({})}>
                <Provider store={store}>
                    <Topic {...data} />
                </Provider>
            </RouterContext.Provider>
        );
        expect(screen.getAllByRole("heading")).toBeTruthy();
    });
});
