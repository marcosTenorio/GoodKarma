import React from 'react';
import karma from "../../karma.png"
import { getAuthToken } from '../with_auth/with_auth';
import { ReplyDetailsInternal } from '../../pages/replyDetails';
import { withRouter } from "react-router";

export interface ReplyDetails {
    id: number;
    userId: number;
    name: string;
    text: string;
    date: string;
    commentCount: number | null;
    karmaCount: number | null;
}

interface ReplyProps extends ReplyDetails {
}

interface ReplyState {
    reply: ReplyDetails | null;
}

export class Reply extends React.Component<ReplyProps, ReplyState> {
    public constructor(props: ReplyProps) {
        super(props);
        this.state = {
            reply: null
        }
    }
    public render() {
        return (
            <table className="comment-details">
                <tbody>
                    <tr>
                        <td className="left">
                            <div>
                                <div>Karma</div>
                                <button onClick={() => this._handleKarmaVote()}>
                                    <img 
                                        src = {karma}
                                        className = "karma"
                                        style = {{height: "30px", padding: "5px"}}
                                    />
                                </button>
                            </div>
                        </td>
                        <td className="right">
                            <div className="audit">{this.renderTimeSinceDate(this.props.date)} ago by {this.props.name}</div>
                            <h2 className="content">{this.props.text}</h2>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    private _handleKarmaVote(){
        (async () => {
            try {
                const token = getAuthToken();
                if(token){
                    if(this.state.reply !== null){
                        const karma = await karmaVote(
                            this.state.reply.id,
                            token
                        );
                    }
                }
            } catch (err){

            }
        })
    }

    private renderTimeSinceDate(jsonDate: string) {
        const time = Date.parse(jsonDate);
        const now = new Date().getTime();
        const difference = (now - time) / 1000;
        const seconds = Math.ceil(difference);
        const minutes = Math.ceil(seconds / 60);
        const hours = Math.ceil(minutes / 60);
        const days = Math.ceil(hours / 24);
        if (seconds < 60) {
            return `${seconds} seconds`;
        } else if (minutes < 60) {
            return `${minutes} minutes`;
        } else if (hours < 24) {
            return `${hours} hours`;
        } else {
            return `${days} days`;
        }
    }
}

export const ReplyDetails = withRouter(props => <ReplyDetailsInternal id={props.match.params.id} />)

async function karmaVote(replyId: number, jwt: string) {
    const update = {
        replyId: replyId
    };
    const response = await fetch(
        `/replies/${replyId}/karmavote`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": jwt
            }
        }
    );
    const json = await response.json();
    return json;
}

