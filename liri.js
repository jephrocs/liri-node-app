require("dotenv").config();
var keys = require("./keys")
var request = require("request")
var Spotify = require("node-spotify-api")
var dateFormat = require("dateFormat")
var fs = require("fs")


var action = process.argv[2]
var command = process.argv[3]


// Search spotify for song. Defaults to lofi playlist
var spotifyThisSong = function(song){
   
    if (!song){
        song = "lo fi hip hop beats to study and relax to"
    }

    var spotify = new Spotify(keys.spotify);

    spotify.search({type: "track", query: song, limit: 1}, function (err, data){
        if (err) {
            return console.log(err)
        }

        // Need to return Artist(s), Song Name, Album, Preview link of song from Spotify
        var songInfo = data.tracks.items[0]
        console.log(songInfo.artists[0].name)
        console.log(songInfo.name)
        console.log(songInfo.album.name)
        console.log(songInfo.preview_url)
    })
}

// Searches imbd for movie
var movieThis = function(movie){
    // Default should be "Mr. Nobody"
    if (!movie){
        movie = "Mr.+Nobody"
        console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
        console.log("its on netflix!")
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  

    // Request to the queryUrl
    request(queryUrl, function(err, response, body){
        // If the request is successful
        if (!err && response.statusCode === 200) {
            // Brings requested info
            var movieInfo = JSON.parse(body)

            console.log("Title: " + movieInfo.Title)
            console.log("Release year: " + movieInfo.Year)
            console.log("IMDB Rating: " + movieInfo.imdbRating)
            console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
            console.log("Country: " + movieInfo.Country)
            console.log("Language: " + movieInfo.Language)
            console.log("Plot: " + movieInfo.Plot)
            console.log("Actors: " + movieInfo.Actors)
        }
    })
}

// Using the `fs` Node package, LIRI will take the text inside of random.txt
// and then use it to call one of LIRI's commands.
var doWhatItSays = function(){

    // read from file
    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err){
            return console.log(err)
        }
        
        var dataArr = data.split(",")

        // call appropriate function and pass arguement
        runAction(dataArr[0], dataArr[1])
    });
}

//log files
var outputData = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err){
        if(err){
            return console.log(err)
        } 
    })
}

var runAction = function(func, parm) {
    switch (func) {
        case "spotify-this-song":
            spotifyThisSong(parm)
            break
        case "movie-this":
            movieThis(parm)
            break
        case "do-what-it-says":
            doWhatItSays()
            break
        default:
            outputData("what you say?") 
    }
}

runAction(action, command)