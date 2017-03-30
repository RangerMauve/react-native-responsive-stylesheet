"use strict";
var tape = require("tape");
var mockRN = require("./mock-rn");
var ResponsiveStylesheet = require("./");

tape("ResponsiveStylesheet.create() should act as pass-through", function (t) {
	t.plan(2);
	var styles = {
		foo: {
			width: 420
		}
	};

	var created = ResponsiveStylesheet.create(styles);

	t.ok(created.$$created, "Got passed through StyleSheet.create");
	t.equal(created.foo, styles.foo, "Didn't modify style");
});

tape("ResponsiveStylesheet.createOriented() should support empty styles", function (t) {
	t.plan(1);
	var styles = {};

	ResponsiveStylesheet.createOriented(styles);

	t.pass("Created without error");
});

tape("ResponsiveStylesheet.createOriented() should support landscape and portrait", function (t) {
	var styles = {
		landscape: {
			foo: {
				width: 420
			}
		},
		portrait: {
			foo: {
				height: 420
			},
			bar: {
				color: "red"
			}
		}
	};

	var created = ResponsiveStylesheet.createOriented(styles);

	// Test for landscape
	mockRN.setDimensions(100, 0);

	t.equal(created.foo, styles.landscape.foo, "Loaded foo style from landscape styles");
	t.notOk(created.bar, "Didn't load bar style");

	// Test for portrait
	mockRN.setDimensions(0, 100);

	t.equal(created.foo, styles.portrait.foo, "Loaded foo style from portrait styles");
	t.equal(created.bar, styles.portrait.bar, "Loaded bar style from portrait styles");

	t.end();
});

tape("ResponsiveStylesheet.createOriented() should support defined orientations", function (t) {
	var styles = {
		landscape: {
			foo: {
				width: 420
			}
		}
	};

	var created = ResponsiveStylesheet.createOriented(styles);

	mockRN.setDimensions(0, 100);

	t.notOk(created.foo, "Foo was not defined");

	t.end();
});

tape("ResponsiveStylesheet.createSized() should support min-width", function (t) {
	var styles = {
		100: {
			foo: {
				width: 100
			},
			bar: {
				height: 100
			}
		},
		10: {
			foo: {
				width: 10
			}
		}
	};

	var created = ResponsiveStylesheet.createSized("min-width", styles);

	mockRN.setDimensions(0, 0);

	t.deepEqual(created.foo, [], "Got empty array when no sizes matched");
	t.deepEqual(created.bar, [], "Got empty array for other style");

	mockRN.setDimensions(10, 0);

	t.deepEqual(created.foo, [{
		width: 10
	}], "Got matching style");

	t.deepEqual(created.bar, [], "Got empty array for other style");

	mockRN.setDimensions(99, 0);

	t.deepEqual(created.foo, [{
		width: 10
	}], "Check for off by one error");

	mockRN.setDimensions(100, 0);

	t.deepEqual(created.foo, [{
		width: 10
	}, {
		width: 100
	}], "Got expected styles in correct order");

	t.deepEqual(created.bar, [{
		height: 100
	}], "Got expected other style");

	t.end();
});

tape("ResponsiveStylesheet.createSized() should support max-height", function (t) {
	var styles = {
		100: {
			foo: {
				width: 100
			},
			bar: {
				height: 100
			}
		},
		10: {
			foo: {
				width: 10
			}
		}
	};

	var created = ResponsiveStylesheet.createSized("max-height", styles);

	mockRN.setDimensions(0, 0);

	t.deepEqual(created.foo, [{
		width: 100
	}, {
		width: 10
	}], "Got expected styles in correct order");

	t.deepEqual(created.bar, [{
		height: 100
	}], "Got expected other style");

	mockRN.setDimensions(0, 10);

	t.deepEqual(created.foo, [{
		width: 100
	}, {
		width: 10
	}], "Got expected styles in correct order");

	t.deepEqual(created.bar, [{
		height: 100
	}], "Got expected other style");

	mockRN.setDimensions(0, 11);

	t.deepEqual(created.foo, [{
		width: 100
	}], "Got only the largest");

	t.deepEqual(created.bar, [{
		height: 100
	}], "Got expected other style");

	mockRN.setDimensions(0, 99);

	t.deepEqual(created.foo, [{
		width: 100
	}], "Check for off by one error");

	mockRN.setDimensions(0, 200);

	t.deepEqual(created.foo, [], "Got empty array when no sizes matched");
	t.deepEqual(created.bar, [], "Got empty array for other style");

	t.end();
});
