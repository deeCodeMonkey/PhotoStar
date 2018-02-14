import React from 'react';

//presentational component with no props
const PhotoItem = (props) => {

    return (
        <div>
            <h3>{props.photo.name}</h3>
            <div className="col-md-2">
                <img className="full" src={props.photo.file} />
            </div>
            <div className="col-md-10">

            </div>
        </div>
    );
}

export default PhotoItem;