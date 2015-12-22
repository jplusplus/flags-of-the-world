var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var year =  req.query.year || 1974
    var lang = req.query.lang || "sv"
    console.log(req.query)
    var api = "http://api.thenmap.net//v1/world/data/" + year + "?data_props=flag|name&data_lang=" + lang

    http.get(api, function(reply){
        var body = ''
        reply.on('data', function(chunk){
            body += chunk
        })
        .on('end', function(){
            var json = JSON.parse(body)
            var data = []
            for (var index in json["data"]){
                if ("flag" in json["data"][index][0]){
                    if (json["data"][index][0].flag.length > 1){
                        console.log(json["data"][index][0].name + " needs flag quantifyers at Wikidata!")
                    }
                    src = json["data"][index][0].flag[0]
                } else {
                    src = "https://upload.wikimedia.org/wikipedia/commons/6/61/Flag.svg"
                }
                data.push({
                    'src': src,
                    'name': json["data"][index][0].name
                })
            }

              res.render('index', { title: 'Flags of the world in ' + year,
                                    data: data 
                                  })
        })
    })
    .on('error', function(e){
          console.log("Got an error: ", e)
    })

})

module.exports = router;
