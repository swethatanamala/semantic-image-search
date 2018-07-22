var request = require('request');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ images: [] }).write()

function insertRandomSplashbaseImage(){
    request.get(
        {'url': 'http://www.splashbase.co/api/v1/images/random',
         qs: {'images_only': true}
         },

        function (error, response, body) {
            if (error) {
                console.error('upload failed:', error);
            }

            if(response.statusCode == 200){
                db.get('images').push(JSON.parse(body)).write();
            }
            else {
                console.error('Request failed', response)
            }
        })
}

function populateDatabase(n=100){
    for (let i=1; i<n; i++) {
        setTimeout(
            function(){
                console.log('Fetching image', i , '/', n)
                insertRandomSplashbaseImage()
            }, i*1000);
    }
}

// populateDatabase()