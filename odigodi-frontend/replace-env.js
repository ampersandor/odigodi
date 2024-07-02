
(async () => {
    const replace = require('replace-in-file');
    const options = {
        files: 'build/index.html',
        from: [
            /%REACT_APP_MAP_URL%/g,
            /%REACT_APP_GOOGLE_TAG_ID%/g,
            /%REACT_APP_GOOGLE_ADS_ID%/g,
        ],
        to: [
            process.env.REACT_APP_MAP_URL,
            process.env.REACT_APP_GOOGLE_TAG_ID,
            process.env.REACT_APP_GOOGLE_ADS_ID,
        ],
    };

    replace(options)
        .then(results => {
            console.log('Replacement results:', results);
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });


})



