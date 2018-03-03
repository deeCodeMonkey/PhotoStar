import React from 'react';
import Modal from 'react-responsive-modal';

const PhotoReviewDeleteModal = (props) => {
    return (
        <div>
            <Modal open={props.modalStatus} onClose={props.modalClose} little>
                <h1>Are you sure you want to delete your picture gallery?</h1>
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                    <button className="btn_orange medium customs-margin" onClick={props.modalClose}>Cancel</button>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                    <button className="btn_orange medium customs-margin" onClick={props.deleteGallery}>Delete</button>
                </div>
            </Modal>
        </div>
    );
};

export default PhotoReviewDeleteModal;




