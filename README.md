# react-native-responsive-stylesheet
[React-native](https://facebook.github.io/react-native/) library for creating stylesheets that return different styles based on screen size.
It does this by dynamically checking the current screen width and height using the [Dimensions](https://facebook.github.io/react-native/docs/dimensions.html) API whenever you render a component.

** NOTE: ** This library does not re-render on screen size changes, if you want to handle those cases, you must listen to the `onLayout` event to trigger a re-render.

## Install

`npm install --save react-native-responsive-stylesheet`

## API

### Importing

```javascript
import ResponsiveStylesheet from "react-native-responsive-stylesheet"
```

### `ResponsiveStylesheet.create()`

Same as `StyleSheet.create`, creates a regular StyleSheet with your styles in it

### `ResponsiveStylesheet.createSized(direction, map) stylesheet`

Creates a responsive stylesheet based size increments or decrements (like media queries)

`map` is an object literal mapping of `{size: obj}` where `size` is an integer representing pixels, and `obj` is a style definition to use with `.create(obj)`

`direction` is one of "min-width", "max-width", "min-height", "max-height", "min-direction" or "max-direction". It's purpose is to determine whether the `size` represents the `width` or `height`, and whether you should look for `size` values higher or greater than the current screen resolution.

* min/max-direction uses the smallest direction value, `height` or `width`.

The return value is a special kind of stylesheet where when you try to get a style, you will get back an array of all styles that are valid for the current resolution. Check the examples for details.

The values are in the proper order to overwrite each other as they progress.

### `ResponsiveStylesheet.createOriented(map)`

Creates a responsive stylesheet based on styles for `landscape` and `portrait` orientations

`map` is an object literal with the optional keys `landscape` and `portrait` pointing to a stylesheet definition used for `.create()`.

The return value is a stylesheet which will dynamically look up the style definition based on whether you're in landscape or portrait mode. See the examples for details

## Examples

### Change direction and margin based on orientation

```javascript
import ResponsiveStylesheet from "react-native-responsive-stylesheet"
import {View} from "react-native";
import React from "react";

var normalStyles = ResponsiveStylesheet.create({
	item: {
		flex: 1,
		backgroundColor: "red",
		alignSelf: "stretch"
	}
});

var responsiveStyles = ResponsiveStylesheet.createOriented({
	landscape: {
		item: {
			marginHorizontal: 16
		},
		container: {
			flexDirection: "row"
		}
	},
	portrait: {
		item: {
			marginVertical: 16
		},
		container: {
			flexDirection: "column"
		}
	}
});

// Stateless component
// Have parent re-render with the `onLayout` event to see changes
export default function OrientedList(){
	var itemStyle = [responsiveStyles.item, normalStyles.item];

	return (
		<View style={styles.container}>
			<View style={item} />
			<View style={item} />
			<View style={item} />
		</View>
	)
}
```

### Responsive grid

```javascript
import ResponsiveStylesheet from "react-native-responsive-stylesheet"
import {View, ScrollView} from "react-native";
import React from "react";

var normalStyles = ResponsiveStylesheet.create({
	container: {
		flexDirection: "row",
		// Make grid items align horizontally and wrap onto new lines
		flexWrap: "wrap",
		justifyContent: "space-around"
	},
	item: {
		backgroundColor: "red",
		// Default on small screens
		width: 64,
		height: 64
	}
});

var responsiveStyles = ResponsiveStylesheet.createSized("min-width", {
	// Make them bigger on tablets
	768: {
		// Make sure you specify the style name and definition you want
		item: {
			width: 128,
			height: 128
		}
	},
	// Make them even bigger on wide screens (desktop)
	1224: {
		item: {
			width: 128,
			height: 128
		}
	},
});


export default function ResponsiveGrid(){
	// Make a flat array of styles since `responsiveStyles.item` will return an array
	var itemStyle = [normalStyles.item].concat(responsiveStyles.item);

	return (
		<ScrollView>
			<View style={normalStyles.container}>
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
				<View style={itemStyle} />
			</View>
		</ScrollView>
	);
}
```

## react-native-web support

Since this module doesn't rely on any native APIs uses ES5 and CommonJS, you should be able to include it in any [react-native-web](https://github.com/necolas/react-native-web) project without any other configuration (other than setting up an alias for `react-native`)
