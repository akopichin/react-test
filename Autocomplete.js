import React from 'react';
import ReactDom from 'react-dom';
import './style.scss';
import linkState from 'react-link-state';

class MyForm extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
          searchText: ''
      }

    }

    render() {
        return (
            <form action=''>
                form searchText: {this.state.searchText}<br />
                <Autocomplete 
                    ref="mycomplete"
                    valueLink={linkState(this, 'searchText')} 
                    fetch={(search) => new Promise((resolve) => 
                            {setTimeout(() =>  resolve(
                                [{ id: 1, name: 'one' }, 
                                 { id: 2, name: 'two'} ]
                             ), 1000); } ) } 
                    itemRender={(item) => <AutocompleteItem key={item.id} ref={item.id} item={item} />}
                />
            </form>
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

    aItemSelect(itemid, itemtext){
        this.setState({ showDropdown: false, searchText: itemtext, searchId: itemid });
        this.props.valueLink.requestChange(itemtext); // or id?
    }

    componentDidUpdate(){
        let iSel = this.aItemSelect;
        if ($('.autocomplete-dropdown .autocomplete-dropdown-item').size() > 0){
            $('.autocomplete-dropdown .autocomplete-dropdown-item').each(function(){
                $(this).off().on('click', function() {
                    iSel($(this).html());
                });
            })
        }
    }

    render() {
        let cls = this.props.cls;
        let searchText = this.state.searchText;
        let aItemSelect = this.aItemSelect;
        let showDropdown = this.state.showDropdown;

/*
        let items = this.state.items.map( item =>  {
            return <AutocompleteItem 
                key={item.id} 
                item={item} 
                //onSelect={aItemSelect.bind(this, item)} 
                />;
        });
        */

        let items = this.state.items.map(this.props.itemRender);

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

class AutocompleteItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        let id = this.props.item.id;
        let text = this.props.item.name;
        //let onSelect = this.props.onSelect;
        //console.log(this.props);

        return (
            <div className="autocomplete-dropdown-item" itemid={id} onClick={this.props.onSelect} >{text}</div>
        )
    }
}

//<div className="autocomplete-dropdown-item" itemid={id} onClick={onSelect}>{text}</div>



/*  render */

ReactDom.render(
    <MyForm />,
    document.getElementById('app')
);

export default Autocomplete