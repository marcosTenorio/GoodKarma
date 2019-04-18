import React from 'react'

export interface LinkPreviewDetails {
    id: number;
    userId: number;
    email: string;
    name: string;
    title: string;
    question: string;
    field: string;
    date: string;
    replyCount: number | null;
}

interface LinkDetailsProps extends LinkPreviewDetails {
    id: number;
}
interface LinkDetailsState {
    //
}

export class LinkDetails extends React.Component<LinkDetailsProps, LinkDetailsState> {
    public render() {
        return (
            <table className="link-details">
                <tbody>
                    <tr>
                        <td className="left">
                            <div className="vote-btn">|</div>

                            <div className="vote-btn">|</div>
                        </td>
                        <td className="right">
                            <div className="audit">{this.renderTimeSinceDate(this.props.date)} ago by {this.props.name}</div>
                            <h2 className="title">{this.props.title}  {this.props.field}</h2>
                            <div className="url">{this.props.question}</div>
                            <div className="comment-count">{this.props.replyCount} Replies</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    private renderTimeSinceDate(jsonDate: string){
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