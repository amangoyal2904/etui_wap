// components/Layout.js
import { FC } from 'react';
import Headers from './Headers';

const Layout:FC = (props) => {
  const { children } = props;
  return (
      <>
      <Headers />  
      <p>Constant header</p>
      <div className='layout'>
        {children}
      </div>
      </>
    );
}

export default Layout;