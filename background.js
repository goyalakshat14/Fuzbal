/* author: ijkilchenko@gmail.com
MIT license */

var vectors;

console.log("it is loading");
$.ajax({
	url: './glove_small_dict.json',
	type: "POST",
	contentType: "application/json",
	dataType: "json",
	success: function (data) {
		console.log("it is loading");
	    vectors = data;
	    console.log("it is loaded");
	}
});

// $.getJSON("./glove_small_dict.json", function(json) {
// 	vectors = json;
// });

var stopWords;

$.ajax({
	url: './stopWords.json',
	type: "POST",
	contentType: "application/json",
	dataType: "json",
	success: function (data) {
	  	stopWords = data;
	}	
});
// $.getJSON("./stopWords.json", function(json) {
// 	stopWords = json;
// });

browser.runtime.onConnect.addListener(function(port) {
	if (port.name == "vectorsLookup") {
		port.onMessage.addListener(function(msg) {
			function subset(keys, dict) {
				dictSubset = {};
				// console.log(dict)
				for (var i = 0; i < keys.length; i++) {
					if (keys[i] in dict) {
						dictSubset[keys[i]] = dict[keys[i]];
					}
				}
				return dictSubset;
			}
			var localWords2Vects = {};

			if (msg.words && msg.words.length > 0) {
				// console.log(msg.words);
				localWords2Vects = subset(msg.words, vectors);
			}
			port.postMessage({localWords2Vects: localWords2Vects});
		});
	} else if (port.name == "stopWordsLookup") {
		port.onMessage.addListener(function(msg) {
			port.postMessage({stopWords: stopWords});
		});
	}
});