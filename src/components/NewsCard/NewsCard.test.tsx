import { getByText, render, screen } from "@testing-library/react";
import { createMockRouter } from "testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { data, noData } from "testData/topic";
import { Provider } from "react-redux";
import { store } from "app/store";
import NewsCard from ".";
import { TopicDataProps } from "types/topic";

const MockComponent = ({ data, type, query, showSynopsis, parameters, seo }) => {
  return (
    <RouterContext.Provider value={createMockRouter({})}>
      <Provider store={store}>
        <NewsCard data={data} type={type} query={query} showSynopsis={showSynopsis} parameters={parameters} seo={seo} />
      </Provider>
    </RouterContext.Provider>
  );
};

describe("NewsCard Component", () => {
  it('should renders "No Data Found" when there is no data', () => {
    const { getByText } = render(
      <MockComponent type={""} query={""} data={noData.searchResult[0]} showSynopsis={false} parameters={""} seo={""} />
    );
    expect(getByText(/No data Found/i));
  });

  it("should renders list when there data", () => {
    const { getByTestId } = render(
      <MockComponent
        data={data.searchResult[0] as TopicDataProps}
        type={"all"}
        query={"yogi"}
        showSynopsis={true}
        parameters={""}
        seo={""}
      />
    );
    const listData = getByTestId("NewsCard");
    expect(listData).toBeInTheDocument();
  });

  it("should render newscard list items", () => {
    const { getAllByTestId } = render(
      <MockComponent
        data={data.searchResult[0] as TopicDataProps}
        type={"all"}
        query={"yogi"}
        showSynopsis={true}
        parameters={""}
        seo={""}
      />
    );
    data.searchResult[0].data.forEach((e, i) => {
      expect(getAllByTestId("newsCardTitle")[i].textContent).toEqual(e.title);
    });
  });
});
