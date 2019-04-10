import * as React from "react";
import { Listview } from "../components/listview/listview";
import { Link } from "react-router-dom";
import { link } from "fs";

let d = new Date();

interface LinksItem {
    user: {
        name: string;
    },
    reply: {
        id: number,
        text: string;
        userId: number;
    },
    id: number;
    title: string;
    question: string;
    field: string;
    date: string;
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
                            // counts how many replies in each link
                            let replies = Object.keys(links.reply).length;
                            let s = (replies <= 1) ? "reply" : "replies";
                            return <div>
                                
                                <h6>{"Posted by "}{links.user.name}    {"----"}      {links.date}</h6>
                                <h4>{links.title}    {"----"}            {links.field}</h4>
                                {links.question}    <h5> {replies} {s}</h5>
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
