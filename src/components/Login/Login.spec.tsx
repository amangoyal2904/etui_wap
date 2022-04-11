import { render, screen, act, cleanup, fireEvent, } from '@testing-library/react'
import user from '@testing-library/user-event';
import { shallow, configure } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux'
import { makeStore } from '../../app/store'
import Login from '.';
import APIS_CONFIG from '../../Network/Apis';
import React from 'react';


configure({ adapter: new Adapter() });
describe('AddText Component', () => {
	afterEach(cleanup);
	test('renders learn react link', () => {
		const store = makeStore()
		render(<Provider store={store}>
			<Login />
		</Provider>);
		const linkElement = screen.getByText(/Sign/i);
		expect(linkElement).toBeInTheDocument();
	})

	it("don't render prime user logo img tag incase of free user", () => {
		const store = makeStore();
		let { queryByTestId } = render(<Provider store={store}><Login /></Provider>);
		let imgTag = queryByTestId('primeUserLogo');// checks for nodes those are not rendered

		expect(imgTag).toBeFalsy();
	})

	it("redirect on sign in click", async () => {
		await act(async () => {
			const store = makeStore();
			let { queryByTestId, getByTestId } = render(<Provider store={store}><Login /></Provider>);
			let NODE_ENV = process.env.NODE_ENV || 'production';

			let loginBaseUrl = APIS_CONFIG.login[NODE_ENV]
			let loginUrl = `${loginBaseUrl}${NODE_ENV == 'development' ? `?ru=${window.location.href}` : ''}`;

			let signInbutton = screen.getByText('Sign In');
			let assignMock = jest.fn();
			delete window.location;
			window.location = ({ assign: assignMock as any }) as Location;
			await fireEvent.click(signInbutton);

			setTimeout(() => {
				expect(window.location.href).toBe(loginUrl);
				afterEach(() => {
					assignMock.mockClear();
				});
			}, 1000);
		})
	})

});
