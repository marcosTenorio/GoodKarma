import * as React from "react"
import { LinkDetails as LinkDetailsComponent } from "../components/link_details/link_details";
import { withRouter } from "react-router";
import { Reply , ReplyDetails } from "../components/reply/reply";
import { Listview } from "../components/listview/listview";
import { getAuthToken } from "../components/with_auth/with_auth";


interface LinkData {
    user: {
        name: string;
    },
    reply: {
        id: number,
        text: string;
        userId: number;
    },
    id: number;
    userId: number;
    name: string;
    title: string;
    question: string;
    field: string;
    dateTime: string;
    replyCount: number | null;
    replies: ReplyDetails[];
}

interface LinkDetailsProps {
    id: string;
}

interface LinkDetailsState {
    link: LinkData | null;
    newReplyContent: string
}

export class LinkDetailsInternal extends React.Component<LinkDetailsProps, LinkDetailsState> {
    public constructor(props: LinkDetailsProps){
        super(props);
        this.state = {
            link: null,
            newReplyContent: ""
        };
    }

    public componentWillMount() {
        (async () => {
            const data = await getData(this.props.id);
            this.setState({ link: data});
        })();
    }

    public render() {
        if (this.state.link === null){
            return <div>Loading...</div>
        }else {
            return <div>
                <LinkDetailsComponent {...this.state.link} />
                <Listview
                    items={
                        this.state.link.replies.map((reply, replyIndex) => {
                            return (
                                <Reply key={replyIndex} {...reply}/>
                            );
                        })
                    }
                />
                {this._renderReplyEditor()}
            </div>;
        }
    }

    private _renderReplyEditor() {
        const token = getAuthToken();
        if (token){
            return (
                <React.Fragment>
                    <div>
                        <textarea
                            className="input-text"
                            placeholder="write your reply here.."
                            value={this.state.newReplyContent}
                            onChange={(e) => this.setState({newReplyContent: e.currentTarget.value})}
                        ></textarea>
                    </div>
                    <div>
                        <button
                            onClick={() => this._handleCreateReply()}
                            style={{ width: "100%"}}
                            className="btn"
                        >
                            Submit
                        </button>
                    </div>
                </React.Fragment>
            );
        } else {
            return <div>Please sign in if you wish to write a reply...</div>;
        }
    }

    private _handleCreateReply() {
        (async () => {
            try {
                const token = getAuthToken();
                if (token && this.state.link) {
                    const newReply = await createReply(
                        this.state.link.id,
                        this.state.newReplyContent,
                        token
                    );
                }
            } catch (err){

            }
        })();
    }
}

export const LinkDetails = withRouter(props => <LinkDetailsInternal id ={props.match.params.id} />)

async function getData(id:string) {
    const response = await fetch(`/links/${id}`);
    const json = await response.json();
    return json as LinkData;
}

async function createReply(linkId: number, content: string, jwt: string) {
    const update = {
        linkId: linkId,
        content: content
    };
    const response = await fetch(
        "/replies",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": jwt
            },
            body: JSON.stringify(update)
        }
    );
    const json = await response.json();
    return json;
}