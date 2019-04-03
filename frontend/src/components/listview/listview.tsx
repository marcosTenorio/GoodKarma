import React from 'react';

interface ListviewProps {
    items: JSX.Element[];
}

interface ListviewState {
    //
}

export class Listview extends React.Component<ListviewProps, ListviewState> {
    public render() {
        const style:  React.CSSProperties = {
            fontFamily: `Rubik,Lato,"Lucida Grande","Lucida Sans Unicode",Tahoma,Sans-Serif`,
            fontSize: "20px",
            border: "1px solid",
            width: "800px"
        };
        if (this.props.items.length < 1) {
            return <div>There is no items!</div>;
        } else {
            return <ul>
                {this.props.items.map(function (item) {
                    return <p style={style}>{item}</p>;
                })}
            </ul>;
        }
    }
}
