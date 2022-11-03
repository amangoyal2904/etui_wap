import { render, within } from "@testing-library/react";
import Tabs from "components/Tabs";

// const mockClickFun = jest.fn();

const MockComponent = ({ TabsName, urlActiveTab, handleClickfun }) => {
  return <Tabs tabsName={TabsName} urlActiveTab={urlActiveTab} handleTabClick={handleClickfun} />;
};
describe("render tabs component", () => {
  it("should render tabs ", () => {
    const TabsName = ["All", "News", "Videos"];
    const { getAllByTestId } = render(
      <MockComponent TabsName={TabsName} urlActiveTab="all" handleClickfun={undefined} />
    );
    const listItems = getAllByTestId("tabs");
    expect(listItems).toHaveLength(3);
    listItems.forEach((item, index) => {
      const { getByText } = within(item);
      expect(getByText(TabsName[index])).toBeInTheDocument();
    });
  });
});
