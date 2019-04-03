import * as React from "react";
import { getAuthToken } from "../components/with_auth/with_auth";

interface User {
    name: string;
    bio: string;
    pic: string;
}

interface ProfileProps {

}

interface ProfileState {
    user: User | null;
}

export class Profile extends React.Component<ProfileProps, ProfileState> {
    public constructor(props: ProfileProps) {
        super(props);
        this.state = {
            user: null
        }
    }
    public componentWillMount() {
        (async () => {
            const token = getAuthToken();
            if (token) {
                const response = await fetch(
                    "/auth/profile",
                    {
                        method: "POST",
                        headers: {
                            "x-auth-token": token
                        }
                    }
                );
                const json = await response.json();
                this.setState({ user: json });
            }
        })();
    }
    public render () {
        const token = getAuthToken();
        if (token) {
            return (
                <div>
                    {this._renderUserDetails()}
                </div>
            );
        } else {
            return (
                <div>This page is private!</div>
            );
        }
    }
    private _renderUserDetails() {
        if (this.state.user === null) {
            return <div>Loading...</div>
        } else {
            return <div>
                <img className="profile_pic" src={this.state.user.pic} />
                <div>Hello, {this.state.user.name}</div>
                <div>{this.state.user.bio}</div>
            </div>;
        }
    }
}