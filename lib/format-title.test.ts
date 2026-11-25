import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatTitle } from "./format-title.ts";

describe("formatTitle", () => {
  it("rejects the missing-space concat from 7f2c42b", () => {
    const page = "My Post";
    const site = "Desktop of Samuel - Samuel Wong — Hong Kong UI/UX Designer";
    const pastBug =
      "My Post| Desktop of Samuel - Samuel Wong — Hong Kong UI/UX Designer";
    const title = formatTitle(page, site);
    assert.equal(title, "My Post | Desktop of Samuel - Samuel Wong — Hong Kong UI/UX Designer");
    assert.notEqual(title, pastBug);
    assert.match(title, / \| /);
  });
});
