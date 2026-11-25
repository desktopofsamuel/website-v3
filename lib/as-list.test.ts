import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { asList } from "./as-list.ts";

describe("asList", () => {
  it("returns [] for the { error } payload /api/books used to send on failure", () => {
    assert.deepEqual(asList({ error: "Failed to fetch books" }), []);
  });

  it("returns [] for null and non-arrays", () => {
    assert.deepEqual(asList(null), []);
    assert.deepEqual(asList(undefined), []);
    assert.deepEqual(asList("nope"), []);
  });

  it("keeps a real item list", () => {
    const books = [{ name: "The Timeless Way of Building", link: "/" }];
    assert.equal(asList(books), books);
  });
});
