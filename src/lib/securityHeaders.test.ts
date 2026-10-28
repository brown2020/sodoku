import assert from "node:assert/strict";
import { describe, it } from "node:test";
import nextConfig from "../../next.config.mjs";

describe("security headers", () => {
  it("turns off the framework banner and sets a baseline policy", async () => {
    assert.equal(nextConfig.poweredByHeader, false);
    const headersFn = nextConfig.headers;
    if (!headersFn) throw new Error("headers() missing");
    const groups = await headersFn();
    assert.equal(groups.length, 1);
    assert.equal(groups[0]?.source, "/:path*");
    const headers = new Map(
      (groups[0]?.headers ?? []).map((header: { key: string; value: string }) => [
        header.key,
        header.value,
      ])
    );
    assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(headers.get("X-Frame-Options"), "DENY");
    assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
    const csp = headers.get("Content-Security-Policy") ?? "";
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /base-uri 'self'/);
  });
});
