import React, { Component } from 'react';

class PhotoReviewTags extends Component {

    state = {
        //ui display
        isHovered: false,
        //ui display
        tagsLoad: false
    }

    componentWillReceiveProps(nextProps) {
        //change state when google tags populate
        if (nextProps.tags) {
            this.setState({ tagsLoad: false });
        }
    }

    handleEnter = () => {
        this.setState({ isHovered: true });
    }

    handleLeave = () => {
        this.setState({ isHovered: false });
    }

    addGoogleVisionTags = async (photoImages, galleryId) => {
        this.setState({ tagsLoad: true });
        let promises = [];

        for (let i = 0; i < photoImages.length; i++) {
            let url = photoImages[i].original;
            promises.push(
                new Promise((resolve, reject) => {
                    Meteor.call('googleVisionAPI.label', url, function (err, res) {
                        if (err) {
                            console.log('===Google API error', err);
                        }
                        resolve(res.responses[0].labelAnnotations);
                    });
                })
            )
        }

        Promise.all(promises)
            .then((results) => {

                let tags = [];
                for (i = 0; i < results.length; i++) {
                    results[i].map((label) => {
                        tags.push(label.description);
                    });
                }
                //remove duplicate tags in array
                let uniqTags = Array.from(new Set(tags))
                //limit number of tags to 25
                let finalTags = uniqTags.slice(0, 25);
                Meteor.call('googleVisionAPI.insertLabels', finalTags, galleryId);
            });
    }

    addTag = (e, photoId) => {
        e.preventDefault();
        let tagKeyword = e.target.newTag.value;

        Meteor.call('photos.addTag', tagKeyword, photoId, function (err, res) {
            if (err) {
                console.log('====ERROR', err);
            }
        });
        e.target.newTag.value = '';
    }

    deleteTag = (tagKeyword, photoId) => {
        Meteor.call('photos.removeTag', tagKeyword, photoId, function (err, res) {
            if (err) {
                console.log('====ERROR', err);
            }
        });
    }

    displayTagInput = (loggedIn, isCurrentUser, userId, tags, photoId, addTag) => {
        if (isCurrentUser(loggedIn, userId) && loggedIn && tags.length < 25) {
            return (
                <div className="col-md-6">
                    <form className="input-group" onSubmit={(e) => { addTag(e, photoId) }}>
                        <span className="input-group-addon tag"><span className="glyphicon glyphicon-check"></span></span>
                        <input type="text" className="form-control tag-input" placeholder="add a tag" name="newTag" />
                    </form>
                </div>
            );
        }
    }

    render() {

        const { loggedIn, userId, tags, photoImages, photoId, isCurrentUser } = this.props;

        return (
            <div className="marg-l">

                {(this.props.isCurrentUser(loggedIn, userId) && !tags && !this.state.tagsLoad) ?
                    <button className="btn btn-default uplod-file" onClick={() => { this.addGoogleVisionTags(photoImages, photoId) }}>
                        Add Automated Photo Tags
                    </button>
                    : ''}

                    <div className="row">
                        <div className="col-md-12">
                            {this.state.tagsLoad ? <div> Tags Loading...</div> : ''}
                            {tags ?
                                tags.map((tag, index) => {
                                    return (
                                        <span key={index} className="tags">
                                            <a className="a-to-text"
                                                onMouseEnter={this.handleEnter}
                                                onMouseLeave={this.handleLeave}>
                                                {tag}
                                                {
                                                    (this.state.isHovered && isCurrentUser(loggedIn, userId)) ?
                                                        <span className="fa fa-remove marg-l" onClick={() => { this.deleteTag(tag, photoId) }}></span>
                                                        : ''
                                                }
                                            </a>

                                        </span>);
                                }) : ''}
                        </div>
                    </div>

                <div className="row">
                    {tags ?
                        <div>{this.displayTagInput(loggedIn, isCurrentUser, userId, tags, photoId, this.addTag)}</div>
                        : 'There are no tags.'}
                </div>
            </div >
        );
    }
}

export default PhotoReviewTags;


