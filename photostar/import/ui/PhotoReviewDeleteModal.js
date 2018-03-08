import React from 'react';
import Modal from 'react-responsive-modal';

const PhotoReviewDeleteModal = (props) => {
    return (
        <div>
            <Modal open={props.modalStatus} onClose={props.modalClose} little>
                <div className="row">
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-10">
                        <h3 className="text-justify customs-margin">Are you sure you want to delete your picture gallery? It cannot be restored after delete.</h3>
                    </div>
                    <div className="col-md-1">
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                        <button className="btn btn-info customs-margin pull-left" onClick={props.modalClose}>Cancel</button>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                        <button className="btn btn-danger customs-margin pull-right" onClick={props.deleteGallery}>Delete</button>
                    </div>
                    <div className="col-md-1">
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PhotoReviewDeleteModal;




