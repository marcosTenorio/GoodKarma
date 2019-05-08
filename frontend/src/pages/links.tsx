import * as React from "react";
import { Listview } from "../components/listview/listview";
import { Link } from "react-router-dom";
import { LinkDetails, LinkPreviewDetails } from "../components/link_details/link_details";
import { getAuthToken } from "../components/with_auth/with_auth";

interface LinksProps {
    id: string;
}

interface LinksState {
    link: LinkPreviewDetails[] | null;
    query: string;
    id: string;
    title: string;
    question: string;
    field: string;
}

const initialState = {
    link: null,
    query: "",
    id: "",
    title: "",
    question: "",
    field: "",
    name: "",
    email: "",
    password: "",
    nameError: "",
    emailError: "",
    passwordError: ""
  };

export class Links extends React.Component<LinksProps, LinksState> {
    public constructor(props: LinksProps) {
        super(props);
        // this.state = {
        //     link: null,
        //     id: "",
        //     query: "",
        //     title: "",
        //     question: "",
        //     field: ""
        // };
        this.state = initialState;
    }
    public componentWillMount() {
        (async () => {
            const data = await getData();
            this.setState({ link: data });
        })();
    }


    public componentWillUpdate() {
        (async () => {
            const data = await getData();
            this.setState({ link: data });
        })();
    }


    public render() {
        if (this.state.link === null) {
            return <div>Loading...</div>;
        } else {
            const filteredLinks = this.state.link.filter((link) => {
                if(link.title.indexOf(this.state.query) !== -1){
                    return link.title.indexOf(this.state.query) !== -1;
                }else if (link.field.indexOf(this.state.query) !== -1){
                    return link.field.indexOf(this.state.query) !== -1;
                }
                
            });
            return <div className = "details">
                <input
                    className="input-text"
                    placeholder="Search"
                    type="text"
                    onKeyUp={(e) => this._onSearch(e.currentTarget.value)}
                />
                {this._renderPostEditor()}
                <Listview
                    items={
                        filteredLinks.map((link, linkIndex) => {
                            return (
                                // <Link to={`/link_details/${link.id}`}>
                                    <LinkDetails key={linkIndex} {...link} />
                                // </Link>
                            );
                        })
                    }
                />
            </div>;
        }
    }

    private _renderPostEditor() {
        const token = getAuthToken();
        if (token) {
            return (
                <React.Fragment>
                    <div className = "link-post">
                    
                        <ul>
                        <input
                            className = "input-title"
                            type="text"
                            placeholder="Title"
                            onKeyUp={(e) => this._updateTitle((e as any).target.value)}
                        />
                        <br />
                        <textarea
                            className = "input-text-post"
                            placeholder="write your question here.."
                            onKeyUp={(e) => this._updateQuestion((e as any).target.value)}
                        />
                        <br />
                        <label>Course Field: </label>
                        <select
                            defaultValue={'DEFAULT'}
                            onChange={e => this.setState({ field: e.target.value })}
                        >
                            <option value="DEFAULT" selected disabled hidden>Choose here</option>
                            <option value="IT">IT</option>
                            <option value="Business">Business</option>
                        </select>
                        <button 
                            className = "btn-post"
                            onClick={() => this._handleSubmit()}>
                            Post
                        </button>
                        </ul>
                    
                    </div>
                    <br></br>

                </React.Fragment>
            )    
        } else{
            return <div>Please log in if you wish to create a new post...<br/></div>;
        }
    }

    // Update the state (title) on keyup
    private _updateTitle(title: string) {
        this.setState({ title: title });
    }
    // Update the state (question) on keyup
    private _updateQuestion(question: string) {
        this.setState({ question: question });
    }

    private _onSearch(query: string) {
        this.setState({ query: query });
    }

    private _handleSubmit() {
            (async () => {
                try {
                    const token = getAuthToken();
                    if(token){
                        const newReply = await createPost(
                        //this.state.user.id,
                        this.state.title,
                        this.state.field,
                        this.state.question,
                        token
                        );
                        this.setState(initialState);
                    }
                } catch (err) {

                }
            })();
    }
}

async function getData() {
    const response = await fetch("/links");
    const json = await response.json();
    return json as LinkPreviewDetails[];
}

async function createPost(title: string, field: string, question: string, jwt: string) {
    const update = {
        title: title,
        field: field,
        question: question
    };
    const response = await fetch(
        "/links",
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
