import React from 'react'

export interface ReplyPreviewDetails {
    id: number;
    userId: number;
    name: string;
    text: string;
    date: string;
    commentCount: number | null;
    karmaCount: number | null;
}

interface ReplyDetailsProps extends ReplyPreviewDetails {
    
}

interface ReplyDetailsState {
    
}

export class RepliesDetails extends React.Component<ReplyDetailsProps, ReplyDetailsState> {
    public render() {
        return (
            <table className="link-details">
                <tbody>
                    <tr>
                        <td className="left">
                            <div>{this.props.karmaCount ? this.props.karmaCount : 0}</div>
                        </td>
                        <td className="right">
                            <div className="audit">{this.renderTimeSinceDate(this.props.date)} ago by {this.props.name}</div>
                            <div className=".................">>{this.props.text}</div>
                            <div className="comment-count">{this.props.commentCount} Comments </div>
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