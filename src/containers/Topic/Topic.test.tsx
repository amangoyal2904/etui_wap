import { render, screen } from "@testing-library/react";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
import Topic from ".";
import { data, noData } from "testData/topic";
import { Provider } from "react-redux";
import { store } from "app/store";

const MockComponent = ({ data }) => {
  return (
    <RouterContext.Provider value={createMockRouter({})}>
      <Provider store={store}>
        <Topic {...data} />
      </Provider>
    </RouterContext.Provider>
  );
};

describe("Topic Component", () => {
  it("renders a container", () => {
    render(<MockComponent data={data} />);
    expect(screen.findAllByTestId("topic")).toBeTruthy();
  });

  it('should renders "No Result Found" when there is no data', () => {
    const { getByText } = render(<MockComponent data={noData} />);
    expect(getByText(/Sorry, there are no results for your search!/i));
  });

  it("render child component ", () => {
    const component = render(<MockComponent data={data} />);
    const childElement = component.getAllByTestId("NewsCard");
    expect(childElement).toBeTruthy();
  });
});
