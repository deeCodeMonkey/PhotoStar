import React from 'react';
import Modal from 'react-responsive-modal';

const PhotoReviewDeleteModal = (props) => {
    return (
        <div>
            <Modal open={props.modalStatus} onClose={props.modalClose} little>
                <h1>Are you sure you want to delete your picture gallery?</h1>
                <button onClick={props.modalClose}>Cancel</button>
                <button onClick={props.deleteGallery}>Delete</button>
            </Modal>
        </div>
    );
};

export default PhotoReviewDeleteModal;




