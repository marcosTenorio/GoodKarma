import React from "react"
import { withRouter } from "react-router-dom";
import * as H from 'history';
import { getAuthToken } from "../components/with_auth/with_auth";
import { setAuthToken } from "../components/with_auth/with_auth";

interface newPostProps {
    history: H.History;
}

interface User {
    id: string;
    name: string;
    bio: string;
    pic: string;
}

interface newPostState {
    title: string;
    question: string;
    field: string;
    error: string | null;
}

export class NewPostInternal extends React.Component<newPostProps, newPostState>{
    public constructor(props: newPostProps){
        super(props);
        this.state = {
            title: "",
            question: "",
            field: "",
            error: null
        };
    }

   

    handleSubmit(e: any){
        e.preventDefault();
    }

    public render() {
        return (
            <div className="inputs">
                <form>
                    <input 
                        type="text"
                        placeholder="Title" 
                        onKeyUp={(e) => this._updateTitle((e as any).target.value)}
                    />
                    <br/>
                    <textarea
                        placeholder="type your question here.." 
                        onKeyUp={(e) => this._updateQuestion((e as any).target.value)}
                    />
                    <br/>
                    <label>Field: </label>
                    <select
                        onChange={e => this.setState({ field: e.target.value})}
                    >
                        <option value="" selected disabled hidden>Choose here</option>
                        <option value="IT">IT</option>
                        <option value="Business">Business</option>
                    </select>

                    <br/>
                    <button onClick={() => this._handleSubmit()}>Submit</button>

                </form>

            </div>
            
        )
    }
    // Update the state (email) on keyup
    private _updateTitle(title: string) {
        this.setState({ title: title });
    }
    // Update the state (password) on keyup
    private _updateQuestion(question: string) {
        this.setState({ question: question });
    }

    private _handleSubmit(){
        (async () => {
            try {
                const token = await getToken(this.state.title, this.state.question, this.state.field);
                // Reset error
                this.setState({ error: null });
                // Save token in window object
                //(window as any).__token = token;
                setAuthToken(token);
                // Redirect to home page
                this.props.history.push("/");
            } catch(err) {
                this.setState({ error: err.error });
            }
        })();
    }
    
}

export const NewPost = withRouter(props => <NewPostInternal {...props}/>);

async function getToken(title: string, question: string, field: string) {
    return new Promise<string>(function (resolve, reject) {
        (async () => {
            const token = getAuthToken();
            const data = {
                title: title,
                question: question,
                field: field
            };
            if (token) {
                const response = await fetch(
                    "/links",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": token
                        },
                        body: JSON.stringify(data)
                    }
                );
                const json = await response.json();
                if (response.status === 200) {
                    resolve(json.token);
                } else {
                    reject(json);
                }
            }
        })();
    });
}


