import React from "react";
import { mount, shallow } from "enzyme";
import App from "../../App";

import "./setupTest";

//import toJson from "enzyme-to-json";

it("renders without crashing", () => {
  shallow(<App />);
});


const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
