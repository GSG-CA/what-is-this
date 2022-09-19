const {
  object,
  petResult,
  object2Result,
  areaFunc,
} = require("./index.js");

test("object.getMessage should return 'Hello, World!'", () => {
  expect(object.getMessage()).toBe("Hello, World!");
});

test("petResult should return 'Fluffy'", () => {
    expect(petResult).toBe("Fluffy");
});

test("object2Result invocation should return 'Hello, World!'", () => {
    expect(object2Result()).toBe("Hello, World!");
});

test("areaFunc invocation should return '200'", () => {
    expect(areaFunc()).toBe(200);
});