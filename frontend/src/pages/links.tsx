import * as React from "react";
import { Listview } from "../components/listview/listview";
import { Link } from "react-router-dom";

let d = new Date();

interface LinksItem {
    userId: number;
    user: {
        name: string;
    },
    id: number;
    title: string;
    question: string;
    field: string;
}

interface LinkssProps {
    //
}

interface LinkssState {
    links: LinksItem[] | null;
    query: string;
}

export class Links extends React.Component<LinkssProps, LinkssState> {
    public constructor(props: LinkssProps) {
        super(props);
        this.state = {
            links: null,
            query: ""
        };
    }
    public componentDidMount() {
        (async () => {
            const data = await getData();
            this.setState({ links: data });
        })();
    }
    public render() {
        if (this.state.links === null) {
            return <div>Loading...</div>;
        } else {
            return <div>
                {this._renderPrivate()}
                <Listview
                    items={
                        this.state.links.map((links) => {
                            return <div>
                                <h6>{"Posted by "}{links.user.name}{"_____________"} {d.toDateString()}</h6>
                                <h4>{links.title}{"______________"} {links.field}</h4>
                                {links.question}
                            </div>; 
                        })
                    }
                />
            </div>;
        }
    }
    private _renderPrivate() {
        const token: string | undefined = (window as any).__token;
        if (typeof token === "string") {
            return <Link style={{ color: "#ffffff" }} to="/profile">Profile</Link>
        }
    }
}

async function getData() {
    const response = await fetch("/links");
    const json = await response.json();
    return json as LinksItem[];
}
