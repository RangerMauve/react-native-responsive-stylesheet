"use strict";
var mock = require("mock-require");

var CURRENT_WIDTH = 0;
var CURRENT_HEIGHT = 0;

module.exports = {
	setDimensions: setCurrent,
};

mock("react-native", {
	StyleSheet: {
		create: createStyle
	},
	Dimensions: {
		get: getCurrent
	}
});

function getCurrent() {
	return {
		width: CURRENT_WIDTH,
		height: CURRENT_HEIGHT
	};
}

function setCurrent(width, height) {
	CURRENT_WIDTH = width;
	CURRENT_HEIGHT = height;
}

function createStyle(style) {
	return Object.assign(style, {
		$$created: true
	});
}
