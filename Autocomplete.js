import React from 'react';
import ReactDom from 'react-dom';
import './style.scss';
import linkState from 'react-link-state';

class MyComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
          searchText: ''
      }

    }

    render() {
        return (
            <div action=''>
                searchText: {this.state.searchText}<br />
                <Autocomplete 
                    valueLink={linkState(this, 'searchText')} 
                    fetch={(search) => new Promise((resolve) => 
                            {setTimeout(() =>  resolve(
                                [{ id: 1, name: 'one' }, 
                                 { id: 2, name: 'two'} ]
                             ), 1000); } ) } 
                    itemRender={(item) => <AutocompleteItem item={item} />}
                />
            </div>
        ) 
    }
}

class Autocomplete extends React.Component {
    constructor(props) {
      super(props);
    
      this.state = { 
        searchText: '',
        searchId: '',
        showDropdown: false,
        items: []
      };

      this.aUpdate = this.aUpdate.bind(this);
      this.aItemSelect = this.aItemSelect.bind(this);
    }

    aUpdate(e){
        let searchText = e.target.value;
        this.setState({searchText: searchText});

        let items = this.props.fetch(searchText);
        
        items.then(result => this.setState({showDropdown: true, items: result}) );
    }

    aItemSelect(item){
        this.setState({ showDropdown: false, searchText: item.name, searchId: item.id });
        this.props.valueLink.requestChange(item.name); // or id?
    }

    render() {
        let cls = this.props.cls;
        let searchText = this.state.searchText;
        let showDropdown = this.state.showDropdown;

        var self = this;
        var aItemSelect = this.aItemSelect.bind(this);


        //let items = this.state.items.map(this.props.itemRender);
        let items = this.state.items.map( (item) => {
            let _item = <li key={item.id} onClick={aItemSelect.bind(self, item)}>{this.props.itemRender(item)}</li>;
            return _item;
        });

        return (
            <div>
                id: {this.state.searchId}<br />
                <input type="text" 
                    className={cls}
                    value={searchText}
                    onChange={this.aUpdate}
                     />
                { showDropdown ? 
                    <ul className="autocomplete-dropdown">
                        {items}
                    </ul>
                    : 
                    null
                }
            </div>
        );
    }
}

Autocomplete.propTypes = {
    cls: React.PropTypes.string
},

Autocomplete.defaultProps = {
    cls: 'my-autocomplete'
}



/*  item */

class AutocompleteItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        let id = this.props.item.id;
        let text = this.props.item.name;

        return (
            <div className="autocomplete-dropdown-item" itemid={id}>{text}</div>
        )
    }
}



/*  render */

ReactDom.render(
    <MyComponent />,
    document.getElementById('app')
);

export default Autocomplete