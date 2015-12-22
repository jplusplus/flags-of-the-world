var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var year =  req.query.year || 1974
    var lang = req.query.lang || "sv"

    if (req.app.get('env') === 'development') {
        var api = "http://localhost:3000/v1/world/data/" + year + "?data_props=flag|name&data_lang=" + lang
    } else {
        var api = "http://api.thenmap.net/v1/world/data/" + year + "?data_props=flag|name&data_lang=" + lang
    }

    http.get(api, function(reply){
        var body = ''
        reply.on('data', function(chunk){
            body += chunk
        })
        .on('end', function(){
            console.log(body)
            var json = JSON.parse(body)["data"]
            var data = []
            for (var index in json){
                if ("flag" in json[index][0]){
                    if (json[index][0].flag.length > 1){
                        console.log(json[index][0].name + " needs flag quantifyers at Wikidata!")
                    }
                    src = json[index][0].flag[0]
                } else {
                    src = "https://upload.wikimedia.org/wikipedia/commons/6/61/Flag.svg"
                }
                data.push({
                    'src': src,
                    'name': json[index][0].name
                })
            }
            data.sort(function(a, b) {
                if(a.name < b.name) return -1
                if(a.name > b.name) return 1
                return 0
            })

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
