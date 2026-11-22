import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { singleFlight } from "./single-flight.ts";

describe("singleFlight", () => {
  it("runs once when two getAccessToken callers overlap", async () => {
    let runs = 0;
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const getAccessToken = singleFlight(async () => {
      runs += 1;
      await gate;
      return "tok";
    });

    const first = getAccessToken();
    const second = getAccessToken();
    release();

    assert.equal(await first, "tok");
    assert.equal(await second, "tok");
    assert.equal(runs, 1);
  });
});
