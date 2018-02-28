import React, { Component } from 'react';

import { Photos } from '../../api/photos';

class SearchBar extends Component {

    state = {
        searchPhotos: []
    }

    componentDidMount() {
        //access updated list
        Tracker.autorun(() => {
            Meteor.subscribe('allPhotos');
        });
    }

    searchTags = async (e) => {
        e.preventDefault();
        let keywords = e.target.keywords.value;
        if (keywords) {
            keywords = keywords.toLowerCase();
            let searchKeywords = keywords.split(/[ ,]+/);

            let arrayTags = [];
            for (let keyword of searchKeywords) {
                arrayTags.push({ tags: keyword});
            }

            const searchPhotos = await Photos.find({
                $or: arrayTags
            }).fetch();
            
            this.setState({ searchPhotos });
            console.log('STATE', JSON.stringify(this.state.searchPhotos, null, 2));
        }
    }

    render() {

        return (
            <div>
                <form onSubmit={this.searchTags}>
                    <div className="form-group col s4">
                        <input name="keywords" type="text" className="form-control" id="keywords" placeholder="keywords" />
                    </div>
                    <button>Search</button>
                </form>
            </div>
        );
    }
}

export default SearchBar;