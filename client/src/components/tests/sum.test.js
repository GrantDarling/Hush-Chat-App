import React from 'react';
import renderer from 'react-test-renderer';
import Navbar from '../Layout/Navbar';

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
