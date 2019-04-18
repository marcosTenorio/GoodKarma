import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from "../with_auth/with_auth";
import logo from "../../logo.png"



interface TopNavBarInternalProps {
    token: string | null;
}

interface TopNavBarInternalState {}


class TopNavBarInternal extends React.Component<TopNavBarInternalProps, TopNavBarInternalState> {
    public render() {
        return (
            <div className="top-navbar">
                <div className="container">
                    <Link className="left" to="/"><img 
                        src = {logo}
                        className = "img"
                        style = {{ height: "50px", padding: "5px"}}
                    />
                    </Link>
                    {this._renderLoginOrProfile()}
                </div>
            </div>
        );
    }


    private _renderLoginOrProfile() {
        if(this.props.token) {
            return <Link className="btn right" to="/profile">User Profile</Link>
        } else {
            return <React.Fragment>
                <Link className="btn right" to="login">Log in</Link>
                <Link className="btn right" to="register">Register</Link>
            </React.Fragment>
        }
    }
}

// withAuth will trigger a re-render
export const TopNavBar = withAuth(props => <TopNavBarInternal token = {props.authToken} />)
