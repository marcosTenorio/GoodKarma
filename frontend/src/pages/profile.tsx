import * as React from "react";
import { getAuthToken } from "../components/with_auth/with_auth";
import { Listview } from "../components/listview/listview";
import { withRouter } from "react-router";

interface Reply {
    id: number;
    userId: number;
    linkId: number;
    text: string;
}

interface Link {
    id: number;
    title: string;
    field: string;
    question: string;
    userId: number;
}

interface User {
    name: string;
    links: Link[];
    replies: Reply[];
}

interface ProfileProps {
    id: string | undefined;
}

interface ProfileState {
    user: null | User;
}

export class ProfileInternal extends React.Component<ProfileProps, ProfileState> {
    public constructor(props: ProfileProps) {
        super(props);
        this.state = {
            user: null
        };
    }

    public componentWillMount() {
        (async () => {
            if (this.props.id) {
                const user = await getUser(this.props.id);
                this.setState({ user: user });
            } else {
                const token = getAuthToken();
                if (token) {
                    const user = await getProfile(token);
                    this.setState({ user: user})
                }
            }
        })();
    }

    public render () {
        if (this.state.user === null) {
            return <div>Loading...</div>;
        } else {
            return <div>
                <div>Hello, {this.state.user.name}</div>
                <Listview
                    items={
                        this.state.user.links.map(link => <div>
                            <h3>{link.title}</h3>
                        </div>)
                    }
                />
                <Listview
                    items={
                        this.state.user.replies.map(reply => <div>
                            <p>{reply.text}</p>
                        </div>)
                    }
                />
            </div>
        }
    }
}

export const Profile = withRouter(props => <ProfileInternal id={props.match.params.id} />);

async function getProfile(token: string) {
    const response = await fetch(
        "auth/profile",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            }
        }
    );
    const json = await response.json();
    return json;
}

async function getUser(id: string) {
    const response = await fetch(
        `users/${id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    const json = await response.json();
    return json;
}