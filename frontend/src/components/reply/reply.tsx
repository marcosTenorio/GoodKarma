import React from 'react';

export interface ReplyDetails {
    id: number;
    userId: number;
    name: string;
    text: string;
    dateTime: string;
}

interface ReplyProps extends ReplyDetails {
    // ..
}

interface ReplyState {
    //
}

export class Reply extends React.Component<ReplyProps, ReplyState> {
    public render() {
        return (
            <table className="reply-details">
            
            
            </table>
        );
    }
}

