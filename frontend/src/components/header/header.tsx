import React from 'react';
import logo from '../../logo.png';


interface HeaderProps {
}


export function Header(props: HeaderProps) {
   
    return <div className="header">
            <a href="/"/><img src={logo} alt="logo" height="40px"></img>
    </div>;
}
