# js/mpl.js — the browser interpreter

`mpl.js` is the M0-core interpreter that runs at
[mpl.codes](https://mpl.codes). This file is the deployed artifact: the
copy in this repo, the copy baked into the site image, and the file served
at `https://mpl.codes/js/mpl.js` are byte-identical (same sha256).

The site repo (`developtheweb/mpl_codes`) does not carry its own copy; its
image build fetches this file pinned to an exact commit SHA and verifies it
against a pinned sha256 checksum. A mismatch fails the site build.

Rules for changing this file:

- Never edit it in a commit that does not also state the behavioral change
  in `DECISIONS.md`.
- Keep it dependency-free and transformation-free — no build step may
  minify it, wrap it, or inject banners, because that would break byte
  identity with the deployed file.
- Run `node --test "js/test/*.test.mjs"` before committing; CI runs the
  same suite.
