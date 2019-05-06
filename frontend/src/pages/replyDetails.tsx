import * as React from "react"
// import { RepliesDetails as ReplyDetailsComponent } from "../components/reply_details/reply_details";
import { Reply } from "../components/reply/reply";
import { Comment, CommentDetails } from "../components/comment/comment";
import { getAuthToken } from "../components/with_auth/with_auth";
import { withRouter } from "react-router";
import { Listview } from "../components/listview/listview";



interface ReplyData {
    id: number;
    userId: number;
    name: string;
    text: string;
    date: string;
    commentCount: number | null;
    karmaCount: number | null;
    comments: CommentDetails[];
}

interface ReplyDetailsProps {
    id: string;
}

interface ReplyDetailsState {
    reply: ReplyData | null;
    newCommentContent: string;
}

export class ReplyDetailsInternal extends React.Component<ReplyDetailsProps, ReplyDetailsState> {
    public constructor(props: ReplyDetailsProps) {
        super(props)
        this.state = {
            reply: null,
            newCommentContent: ""
        };
    }

    public componentWillMount() {
        (async () => {
            const data = await getData(this.props.id);
            this.setState({ reply: data});
        })();
    }

    public render() {
        if (this.state.reply === null) {
            return <div>Loading...</div>;
        } else {
            return <div>
                <Reply {...this.state.reply} />
                <Listview
                    items={
                        this.state.reply.comments.map((comment, commentIndex) => {
                            return (
                                <Comment key={commentIndex} {...comment} />
                            );
                        })
                    }
                />
                {this._renderCommentEditor()}
            </div>;
        }
    }

    private _renderCommentEditor() {
        const token = getAuthToken();
        if (token) {
            return (
                <React.Fragment>
                    <div>
                        <textarea
                            className="input-text"
                            placeholder="Write your comment here"
                            value={this.state.newCommentContent}
                            onChange={(e) => this.setState({ newCommentContent: e.currentTarget.value })}
                        ></textarea>
                    </div>
                    <div>
                        <button
                            onClick={() => this._handleCreateComment()}
                            style={{ width: "60%" }}
                            className="btn"
                        ></button>
                    </div>
                </React.Fragment>
            );
        } else {
            return <div>Please sign in if you wish to write a comment...</div>;
        }
    }


    private _handleCreateComment() {
        (async () => {
            try {
                const token = getAuthToken();
                if (token && this.state.reply) {
                    const newComment = await createComment(
                        this.state.reply.id,
                        this.state.newCommentContent,
                        token
                    );
                }
            } catch (err){

            }
        })();
    }
}

export const ReplyDetails = withRouter(props => <ReplyDetailsInternal id={props.match.params.id} />)


async function getData(id: string) {
    const response = await fetch(`/replies/${id}`);
    const json = await response.json();
    return json as ReplyData;
}

async function createComment(replyId: number, text: string, jwt: string) {
    const update = {
        replyId: replyId,
        text: text
    };
    const response = await fetch(
        "/comments",
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "x-auth-token": jwt
            },
            body: JSON.stringify(update)
        }
    );
    const json = await response.json();
    return json;
}








