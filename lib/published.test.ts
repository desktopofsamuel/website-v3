import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { published } from "./published.ts";

describe("published", () => {
  it("drops draft docs so they cannot enter generateStaticParams", () => {
    const docs = [
      { slug: "secret", draft: true },
      { slug: "live" },
      { slug: "also-secret", draft: true },
    ];
    assert.deepEqual(
      published(docs).map((doc) => doc.slug),
      ["live"]
    );
  });
});
