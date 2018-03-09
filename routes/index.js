const express = require('express')
const http = require('http')
const router = express.Router()
const sprintf = require('sprintf')

/* GET home page. */
router.get('/', function(req, res, next) {

    var year =  req.query.dateyear || req.query.year || req.query.date || "1974"
    var month =  sprintf('%02d', parseInt(req.query.datemonth || "01", 10))
    var day =  sprintf('%02d', parseInt(req.query.dateday || "01", 10))
    var date = [year, month, day].join("-")
    var lang = req.query.lang || "sv"

    const api = `http://api.thenmap.net/v2/world/data/${date}?data_props=flag|name&language=${lang}`

    /* Available languages for this dataset: http://api.thenmap.net/v1/world/info */
    var availableLanguages = ["sv","en","fi","fr","de","es","ru","it","nl","pl","zh","pt","ar","ja","fa","nn","no","he","tr","da","uk","ca","id","hu","vi","ko","et","cs","hi","sr","bg","nn"]

    http.get(api, function(reply){
        var body = ''
        reply.on('data', function(chunk){
            body += chunk
        })
        .on('end', function(){
            var json = JSON.parse(body)
            var data = []
            let src
            for (var index in json){
                if ("flag" in json[index]){
                    if (!json[index].flag){
                        console.log(json[index].name + " needs flag quantifyers at Wikidata!")
                    }
                    if (Array.isArray(json[index].flag)){
                        src = json[index].flag[0]
                    } else {
                        src = json[index].flag
                    }
                } else {
                    src = "https://upload.wikimedia.org/wikipedia/commons/6/61/Flag.svg"
                }
                data.push({
                    'src': src,
                    'name': json[index].name
                })
            }
            data.sort(function(a, b) {
                if(a.name < b.name) return -1
                if(a.name > b.name) return 1
                return 0
            })

              res.render('index', { title: 'Flags of the world in ' + year,
                                    data: data,
                                    availableLanguages: availableLanguages,
                                    selectedLanguage: lang,
                                    dateyear: year,
                                    datemonth: month,
                                    dateday: day,
                                    date: date,
                                    currentYear: new Date().getFullYear()
                                  })
        })
    })
    .on('error', function(e){
          console.log("Got an error: ", e)
    })

})

module.exports = router;
