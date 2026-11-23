---
"@motiro/core": patch
---

Re-export `@motiro/number`, available from the root entry point and the new `@motiro/core/number` subpath.

`@motiro/number` and `@motiro/string` both export `interpolate` and `random`, so the root now exports each under a suffixed alias: `interpolateNumber` / `interpolateString`, `randomNumber` / `randomString`, and `InterpolateNumberOptions` / `InterpolateStringOptions` for the options types. The unsuffixed `interpolate`, `random` and `InterpolateOptions` stay bound to `@motiro/string`, so existing imports keep working. The domain subpaths keep the original names.
