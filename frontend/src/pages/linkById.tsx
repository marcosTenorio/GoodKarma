import * as React from "react";
import { Listview } from "../components/listview/listview";
import { Link } from "react-router-dom";
import { getAuthToken } from "../components/with_auth/with_auth";



// component should show only 1 link with its replies
// GET LINK BY ID


interface RepliesItem {
    user: {
        name: string;
    },
    reply: {
        id: number,
        text: string;
        userId: number;
        date: string;
    },
    id: number;
    title: string;
    question: string;
    field: string;
    date: string;
}


interface RepliesProps {
    token: string | null;
}

interface RepliesState {
    replies: RepliesItem[] | null;
}

export class LinkById extends React.Component<RepliesProps, RepliesState> {
    public constructor(props: RepliesProps) {
        super(props);
        this.state = {
            replies: null
        };
    }
    public componentDidMount() {
        (async () => {
            const data = await getData();
            this.setState({ replies: data });
        })();
    }

    public render() {
            return <div>
                {this._renderPrivate()}
            </div>;
    }

    private _renderPrivate() {
        const token = getAuthToken();
        if(token){
            if (this.state.replies === null) {
                return <div>Loading...</div>;
            } else {
                return <div>
                    <Listview
                        items={
                            this.state.replies.map((replies) => {
                                return <div>
                                    
                                    <h6>{"Posted by "}{replies.user.name}    {"----"}      {replies.date}</h6>
                                </div>; 
                            })
                        }
                    />
                </div>;
            }
        }else{
            return <div>
                <h3>{ "ERROR, You must be logged in to see this link"}</h3>
            </div>
        }
    }
}

async function getData() {
    const response = await fetch("/links");
    const json = await response.json();
    return json as RepliesItem[];
}
