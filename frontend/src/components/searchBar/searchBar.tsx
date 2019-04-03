import React from 'react';


interface SearchProps {
}

interface SearchState {
    term: string;
}

export class SearchBar extends React.Component<SearchProps, SearchState> {

  public constructor(props: SearchProps){
    super(props);
    this.state = {
        term: ""
    };
  }
  

    public render() {
        return (
            <div className="search-box">
              <input className="search-input"
                     type="text" 
                     placeholder="Search"
                     onKeyUp={(e) => this._updateText((e as any).target.value)} 
              />
            </div>
        );
    }


    // Update the state (term) on keyup
    private _updateText(term: string) {
        this.setState({ term: term });
    }
}



 
export default SearchBar;