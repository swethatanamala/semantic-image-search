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

function requestVisionAPI(imageUrl, callback){
    const request = require('request');
    const myKey = config.MY_KEY;
    const secretkey = config.SECRET_KEY;
    const subscriptionKey = myKey;
    const uriBase =
    'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze';
    const params = {
        'visualFeatures': 'Categories,Description,Color,Tags,Faces,Adult,ImageType',
        'details': 'Celebrities,Landmarks',
        'language': 'en'
    };

    const options = {
        uri: uriBase,
        qs: params,
        body: '{"url": ' + '"' + imageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    };

    request.post(options, (error, response, body) => {
        if (error) {
            console.error('Error: ', error);
            return
        }
        if(response.statusCode == 200){
            let jsonResponse = JSON.parse(body);
            callback(jsonResponse)
            return
        }
        else {
            console.error('Request failed', response.statusCode)
        }
    });
}

function updateDatabaseWithVisionTags(){
    var images = db.get('images').value()
    for (let i=0; i < images.length; i++){
        setTimeout(
            function(){
                var jsonResponse = requestVisionAPI(
                    images[i].url,
                    function(json){
                        db.get('images').find({'id':images[i].id}).assign({'msVisionTags': json}).write()
                        console.log('Succesfully updated vision tags for', images[i].id, i, '/', images.length)
                    });
            }, (i+1)*5000);
    }

}


// updateDatabaseWithVisionTags()
// populateDatabase()