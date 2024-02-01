// use http server
const http = require('http'); // If making an HTTP request
const https = require('https'); // If making an HTTPS request

// ebay token
const OAuthToken = require('./ebay_oauth_token.js');
const client_id = 'My-client-Id';
const client_secret = 'My-secret-Id';
const OAuthTokenInstance = new OAuthToken(client_id, client_secret);
const axios = require('axios');

// mongoDB
const {MongoClient, ObjectId} = require('mongodb');
const client = new MongoClient('mongodb+srv://myaccount:mypassword@link')


//CORS
const cors = require('cors');


// resultsMap
var resultsMap = new Map();


// initalize the app
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.static('frontend6'));
app.use(cors());

app.all("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200); 
    else
        next();
})


app.get('/', function (req, res) {
   res.send('Hello World');
})

app.get('/dologin', function(req, res){
    console.log(req.body);
    res.json({"msg":'post successfully'});
})

app.post('/getsearchUrl',function(req, res){
    data = req.body;
    console.log("Backend get json for searching:" + data);
    apiUrl = getResultsUrl(data);
    console.log('apiUrl = ', apiUrl);

    res.json({"url":apiUrl});
})


app.post('/search', function(req, res){
    // res.json({"msg":"can connect"});
    
    data = req.body;
    
    console.log("Backend get json for searching:" + data);
    apiUrl = getResultsUrl(data);
    console.log('apiUrl = ', apiUrl);

    https.get(apiUrl, (response) => {
        let data = '';
        // Data is received in chunks, so we need to accumulate it
        response.on('data', (chunk) => {
          data += chunk;
        });
      
        // Once all data is received, parse and print the JSON
        response.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            console.log('Successfully get items from eBay.');
            storeResultsToBackend(jsonData); // store results temporarily in Node.js backend
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        });
      }).on('error', (error) => {
        console.error('Error making the request:', error);
    });


})


function storeResultsToBackend(jsonData){
    if(jsonData != undefined && jsonData.findItemsAdvancedResponse != undefined && jsonData.findItemsAdvancedResponse[0].searchResult != undefined){
        
        let items = jsonData.findItemsAdvancedResponse[0].searchResult[0].item;

        // store resultsMap to Node.js backend
        for(var item of items){
            // console.log('item = ', item);
            // let currItemId = item.itemId;
            let currItemId = item.itemId[0];

            // console.log('currItmeId[0] = ', currItemId, typeof(currItemId));

            if(!resultsMap.has(currItemId)){
                resultsMap.set(currItemId, item);
            }
        }
    }
    console.log("Node.js ResultsMap.size = ", resultsMap.size);
}
        
app.post('/getresultvalue', function(req, res){
    // req = {"itemId": itemId}
    let itemId = req.body.itemId;
    // console.log(itemId);
    if(resultsMap.has(itemId)){
        res.json(resultsMap.get(itemId));
    }else{
        res.json({"msg":"Not find in Node.js server!"});
    }
})



var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})


function getConditionCode(key){
    if(key == "new"){
        return 1000;
    }else if(key == "used"){
        return 3000;
    }else if(key == "verygood"){
        return 4000;
    }else if(key == "good"){
        return 5000;
    }else if(key == "acceptable"){
        return 6000;
    }
}

function getResultsUrl(data,keywords, sortBy, priceFrom, priceTo, conditions, seller, shippingFree, shippingExpedited){
    
    let apiUrl= "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&" + 
    "SERVICE-VERSION=1.0.0&" + 
    "SECURITY-APPNAME=Zhanshan-csci570h-PRD-e7284ce84-b621a0b0&" +
    "RESPONSE-DATA-FORMAT=JSON&" + 
    "RESTPAYLOAD&" + 
    "paginationInput.entriesPerPage=50&" +
    "outputSelector(0)=SellerInfo&" +
    "outputSelector(1)=StoreInfo&";


    //Keywords
    apiUrl += "keywords=" + data.keyword + "&";
    //category
    if(data.category != '0'){
        apiUrl += "categoryId=" + data.category + "&"; 
    }
    //condition:    condition: {"new":false, "used":false, "unspecified":false},
    let filterIndex = 0;
    // console.log("data.condition.new == ", data.condition.new, data.condition.new == true, data.condition.new == "true");
    if(data.condition.new == true || data.condition.used == true){
        apiUrl += `itemFilter(${filterIndex}).name=Condition&`;
        let condition_idx = 0;

        if(data.condition.new == true){
            let condition_code = getConditionCode("new");
            apiUrl += `itemFilter(${filterIndex}).value(${condition_idx})=${condition_code}&`;
            condition_idx++;
        }
        if(data.condition.used == true){
            let condition_code = getConditionCode("used");
            apiUrl += `itemFilter(${filterIndex}).value(${condition_idx})=${condition_code}&`;
            condition_idx++;
        }
        filterIndex++;
    }
    
    // shipping options:     shipping: {"localPickUp":false, "freeShipping":false},
    if(data.shipping.localPickUp == true ){
        apiUrl += `itemFilter(${filterIndex}).name=LocalPickupOnly&`;
        apiUrl += `itemFilter(${filterIndex}).value=true&`;
        filterIndex++;
    }
    if(data.shipping.freeShipping == true ){
        apiUrl += `itemFilter(${filterIndex}).name=freeShipping&`;
        apiUrl += `itemFilter(${filterIndex}).value=true&`;
        filterIndex++;
    }

    // distance
    apiUrl += `itemFilter(${filterIndex}).name=MaxDistance&`;
    apiUrl += `itemFilter(${filterIndex}).value=${data.distance}&`;
    filterIndex++;

    // zipcode: buyerPostalCode=90007
    apiUrl += "buyerPostalCode=" + data.zipcode + "&";


    return apiUrl;
}

app.post('/productinfo', function(req, res){
 
    OAuthTokenInstance.getApplicationToken()
    .then((accessToken) => {
        // console.log('Access Token:', accessToken);
        console.log('req.body=',req.body);

        const url = 'https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=Zhanshan-csci570h-PRD-e7284ce84-b621a0b0&siteid=0&version=967&'+
        'ItemID='+ req.body.itemId+ '&' 
         + 'IncludeSelector=Description,Details,ItemSpecifics'; 
        // const url = 'https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=Zhanshan-csci570h-PRD-e7284ce84-b621a0b0&siteid=0&version=967&'+
        // 'ItemID='+'132961484706'+ '&'
        // 'IncludeSelector=Description,Details,ItemSpecifics'; 
        console.log(url);

        const headers = {
            'X-EBAY-API-IAF-TOKEN': accessToken,
            'Content-Type': 'application/json', // content type
        };

        axios.get(url, { headers })
            .then((response) => {
                // send data to front-end
                console.log("Successfully get pruductinfo from ebay API.")
                // console.log('API Response:', response.data);
                res.json(response.data);
            })
            .catch((error) => {
                console.error('Error making API request:', error);
            });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    

})

function getPhotosUrl(product_title){
    
    let apiKey = "myApiKey";
    let searchEngineKey = "myEngineKey";

    apiUrl = "https://www.googleapis.com/customsearch/v1?q=" + product_title 
     + "&cx=" + searchEngineKey + "&imgSize=huge&num=8&searchType=image&key=" + apiKey;
    
    return apiUrl;
}

app.post('/searchphotos', function(req, res){

    data = req.body;
    console.log("Backend get photos Title:" + data.title);
    apiUrl = getPhotosUrl(data.title);
    console.log('apiUrl = ', apiUrl);

    https.get(apiUrl, (response) => {
        let data = '';
        // Data is received in chunks, so we need to accumulate it
        response.on('data', (chunk) => {
          data += chunk;
        });
      
        // Once all data is received, parse and print the JSON
        response.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            console.log('Successfully get photos from Google.');
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        });
      }).on('error', (error) => {
        console.error('Error making the request:', error);
    });

})

app.post('/searchsimilar', function(req, res){

    OAuthTokenInstance.getApplicationToken()
    .then((accessToken) => {
        // console.log('Access Token:', accessToken);
        console.log('sdfsdfsdfdsfsdfsdfsdf', req.body.itemId);
        const url = 
        "https://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&" + 
        "SERVICE-NAME=MerchandisingService&SERVICEVERSION=1.1.0&" + 
        "CONSUMER-ID=Zhanshan-csci570h-PRD-e7284ce84-b621a0b0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&" +
        "itemId=" +  req.body.itemId +
        "&maxResults=20";
        
        console.log(url);

        const headers = {
            'X-EBAY-API-IAF-TOKEN': accessToken,
            'Content-Type': 'application/json', // content type
        };

        axios.get(url, { headers })
            .then((response) => {
                // send data to front-end
                console.log("Successfully get similarResults from ebay API.")
                // console.log('API Response:', response.data);
                res.json(response.data);
            })
            .catch((error) => {
                console.error('Error making API request:', error);
            });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
})

app.post('/storeitem', function(req, res){
    item = req.body;
    console.log("Backend successfully get json for storing.");

    // check if this item already in mongoDB
    let currItemId = item.itemId;
    searchItemMongoDB({itemId: currItemId}).then(searchResult => {
        if(searchResult.length == 0){ // no item in mongoDB, do insertion
            insertItemToMongoDB(item).then(insertResult => {
                res.json({"code":"INSERTED","msg":"Successfully stored item to MongoDB"});
            }).catch(error => {
                res.json({"code":"INSERT_ERROR","msg":"Failed to store item to MongoDB"});
                console.error(error);
              });
            
        }else{ // already have a item in mongodb, delete it
            deleteItemMongoDB({"itemId": currItemId}).then(deleteResult => {
                res.json({"code":"DELETED","msg":"The item already exists, we delete item from MongoDB"});
            }).catch(error => {
                res.json({"code":"DELETE_ERROR","msg":"The item already exists, but we failed to delete item to MongoDB"});
                console.error(error);
              });
        }
    });
})

app.post('/initialize', function(req, res){
    searchItemMongoDB({}).then(searchResult => {
        res.json(searchResult);
    });
})


// DAO
async function searchItemMongoDB(conditionJSON) {
    try {
        
        const db = client.db('dbhw3');
        const coll = db.collection('collhw3');
        const result = await coll.find(conditionJSON).toArray();
        console.log('[SEARCH RESULT]:', result);
        return result;
    } catch (error) {
        console.error('Error while inserting into MongoDB:', error);
        throw error;
    }
}

async function insertItemToMongoDB(item) {
    try {
        const db = client.db('dbhw3');
        const coll = db.collection('collhw3');
        const result = await coll.insertOne(item);
        console.log('[INSERT RESULT]:',result);
        return result;
    } catch (error) {
        console.error('Error while inserting into MongoDB:', error);
        throw error;
    }
}

async function deleteItemMongoDB(conditionJSON) {
    try {
        
        const db = client.db('dbhw3');
        const coll = db.collection('collhw3');
        const result = await coll.deleteMany(conditionJSON)
        console.log('[DELETE RESULT]:',result);
        return result;
    } catch (error) {
        console.error('Error while deleting from MongoDB:', error);
        throw error;
    }
}

app.post('/removeitem', function(req, res){
    item = req.body;
    console.log("Backend successfully get json for removing.");

    // check if this item already in mongoDB
    let currItemId = item.itemId;
    searchItemMongoDB({itemId: currItemId}).then(searchResult => {
        if(searchResult.length == 0){ // no item in mongoDB, do nothing
            res.json({"code":"NOTFOUND","msg":"Did not found this item to delete in MongoDB"});
        }else{ // have a item in mongodb, delete it
            deleteItemMongoDB({"itemId": currItemId}).then(deleteResult => {
                res.json({"code":"DELETED","msg":"The item to delete is found, we delete item from MongoDB"});
            }).catch(error => {
                res.json({"code":"DELETE_ERROR","msg":"The item to delete is found, but we failed to delete item to MongoDB"});
                console.error(error);
            });
        }
    });
})


app.post('/getzipcodes', function(req, res){ // req.body = {"currZipcode": this.currZipcode}
    let currZipcode = req.body.currZipcode;
    console.log("Backend get zipcode for recommend:" + currZipcode);
    let apiUrl = 'http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=' 
    + currZipcode 
    + '&maxRows=5&username=zhanshan&country=US';
    console.log('zipcodeApiUrl = ', apiUrl);

    http.get(apiUrl, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData); // Send the data as a response
            } catch (error) {
                console.error('Error get zipcode and parse JSON:', error);
            }
        })
    }).on('error', (error) => {
        console.error('Error get zipcode from API:', error);
    });

})









