import React from 'react';

export interface CommentDetails {
    id: number;
    userId: number;
    name: string;
    text: string;
    date: string;
}

interface CommentProps extends CommentDetails {
    // ...
}

interface CommentState {
    //
}

export class Comment extends React.Component<CommentProps, CommentState> {
    public render(){
        return (
            <table className="comment-details">
                <tbody>
                    <tr>
                        <td className="left">
                        
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