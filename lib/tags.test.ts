import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildTagIndex, postHasTag } from "./tags.ts";

describe("buildTagIndex", () => {
  it("counts Design and design as one tag", () => {
    const index = buildTagIndex([
      { tags: ["Design"] },
      { tags: ["design"] },
      { tags: ["Design", "design"] },
    ]);
    assert.equal(index.length, 1);
    assert.equal(index[0].slug, "design");
    assert.equal(index[0].count, 3);
    assert.equal(index[0].path, "/tags/design");
  });

  it("does not treat raw unique() labels as identity", () => {
    const raw = ["Design", "design"];
    const uniqueRaw = [...new Set(raw)];
    assert.equal(uniqueRaw.length, 2);
    assert.equal(buildTagIndex([{ tags: raw }]).length, 1);
  });
});

describe("postHasTag", () => {
  it("matches a kebab route param to mixed-case frontmatter", () => {
    assert.equal(postHasTag({ tags: ["Design Journal"] }, "design-journal"), true);
    assert.equal(postHasTag({ tags: ["Design Journal"] }, "design"), false);
  });
});
