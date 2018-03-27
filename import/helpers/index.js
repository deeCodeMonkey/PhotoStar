
export const truncateText = (text, length) => {
    let newText = text.substring(0, length);
    newText = newText.substr(0, Math.min(newText.length, newText.lastIndexOf(' ')));
    if (text.length > 150) {
        return `${newText} ...`;
    }
    return `${newText}`;
}

//'reviews' object with rating array
export const avgReview = (reviews) => {
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
        sum += parseInt(reviews[i].rating);
    }
    let avg = sum / reviews.length;
    return Math.round(avg * 10) / 10;
}

//get client collection from mongodb aggregation pipeline
export const fetchClientReport = (clientReport) => {
    return clientReport.find().fetch();
}
