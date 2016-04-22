import React from 'react';
import ReactDom from 'react-dom';
import './style.scss';

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
      this.fetch = this.fetch.bind(this);
    }

    aUpdate(e){
        let searchText = e.target.value;
        this.setState({searchText: searchText});

        let items = this.fetch(searchText);
        
        items.then(result => this.setState({showDropdown: true, items: result}) );
    }

    fetch(val) {
        // val is our searchText so pass to search query - in our case just replaced with timeout
        return new Promise(
            (resolve) => {
                setTimeout(() =>  resolve([{ id: 1, name: 'one' }, { id: 2, name: 'two'} ]), 1000);
            }
        );
    }

    aItemSelect(itemid, itemtext){
        this.setState({ showDropdown: false, searchText: itemtext, searchId: itemid });
    }

    render() {
        let cls = this.props.cls;
        let searchText = this.state.searchText;
        let aItemSelect = this.aItemSelect;
        let showDropdown = this.state.showDropdown;

        let items = this.state.items.map( item =>  {
            return <DropdownItem 
                key={item.id} 
                itemid={item.id} 
                itemtext={item.name} 
                onSelect={aItemSelect.bind(this, item.id, item.name)} 
                />;
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
                    <div className="autocomplete-dropdown">
                        {items}
                    </div>
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

class DropdownItem extends React.Component {
    render() {
        let id = this.props.itemid;
        let text = this.props.itemtext;
        let onSelect = this.props.onSelect;

        return (
            <div className="autocomplete-dropdown-item" itemid={id} onClick={onSelect}>{text}</div>
        )
    }
}



/*  render */

ReactDom.render(
    <Autocomplete />,
    document.getElementById('app')
);

export default Autocomplete