"use strict";
var ReactNative = require("react-native");

var StyleSheet = ReactNative.StyleSheet;
var Dimensions = ReactNative.Dimensions;

var VALID_direction = [
	"min-width",
	"max-width",
	"min-height",
	"max-height"
];

module.exports = {
	create: create,
	createSized: createSized,
	createOriented: createOriented,
};

// Pass-through
function create(styles) {
	return StyleSheet.create(styles);
}

// Create sheet based on size increments for a certain direction
function createSized(direction, map) {
	if(VALID_direction.indexOf(direction) === -1)
		throw new TypeError("direction must equal " + VALID_direction.join(" or "));

	var sizes = Object.keys(map).sort();

	var stylesheets = sizes.reduce(function(result, size){
		var stylesheet = map[size];

		result[size] = StyleSheet.create(stylesheet);

		return result;
	});

	var styleNames = sizes.reduce(function(names, size){
		return names.concat(Object.keys(map[size]));
	}, []);

	return styleNames.reduce(function(sheet, styleName){
		if(styleName in sheet) return sheet;

		Object.defineProperty(sheet, styleName, {
			get: getStyles
		});

		function getStyles() {
			var valid = validSizes(direction, sizes);

			return valid.reduce(function(styles, size){
				var stylesheet = stylesheets[size];
				var style = stylesheet[styleName];

				if(!style) return styles;
				return styles.concat(style);
			}, []);
		}

		return sheet;
	}, {});
}

// Creates sheet based on landscape or portrait orientation
function createOriented(map) {
	var landscapeStyles = map.landscape || {};
	var portraitStyles = map.portrait || {};


	var landscapeStylesheet = StyleSheet.create(landscapeStyles);
	var portraitStylesheet = StyleSheet.create(portraitStyles);

	var stylesheets = {
		landscape: landscapeStylesheet,
		portrait: portraitStylesheet
	};

	var styleNames = Object.keys(landscapeStyles).concat(Object.keys(portraitStyles));

	return styleNames.reduce(function(sheet, styleName){
		if(styleName in sheet) return sheet;

		Object.defineProperty(sheet, styleName, {
			get: getStyle
		});

		function getStyle() {
			var orientation = getOrientation();
			return stylesheets[orientation][styleName];
		}

		return sheet;
	}, {});
}

function validSizes(direction, sizes) {
	var dimensions = Dimensions.get("window");

	var dimensionName = direction.slice(4);
	var dimension = dimensions[dimensionName];

	var directionName = direction.slice(0, 3);
	var greater = directionName === "min";

	return sizes.filter(function (size) {
		var parsed = parseInt(size, 10);
		return greater ? (
			parsed >= dimension
		) : (
			parsed <= dimension
		);
	});
}

function getOrientation(){
	var dimensions =  Dimensions.get("window");

	return (dimensions.width > dimensions.height) ? "landscape" : "portrait";
}
