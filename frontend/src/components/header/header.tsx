import React from 'react';


interface HeaderProps {
    
    color?: string;
}


export function Header(props: HeaderProps) {
    return <div>
    
    </div>;

    };
    


/*
export class Header extends React.Component<HeaderProps, HeaderState> {
    public render() {
        const style: React.CSSProperties = {
            fontFamily: `Rubik,Lato,"Lucida Grande","Lucida Sans Unicode",Tahoma,Sans-Serif`,
            fontSize: "56px",
            fontWeight: 700,
            color: this.props.color !== undefined ? this.props.color : "#000000",
            borderBottom: "3px solid"
        };
        return <div>
            <h1 style={style}>{this.props.label}</h1>
        </div>;
    }
}
*/
