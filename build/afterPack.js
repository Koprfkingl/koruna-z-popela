/* Linux: the Chromium sandbox does not start inside an AppImage on many distributions
   (setuid helper or user namespaces are blocked) and the window stays black.
   Wrap the binary in a small script that always starts it with --no-sandbox. */
const fs = require('fs');
const path = require('path');

exports.default = async function (ctx) {
  if (ctx.electronPlatformName !== 'linux') return;
  const name = ctx.packager.executableName;
  const bin = path.join(ctx.appOutDir, name);
  fs.renameSync(bin, bin + '.bin');
  fs.writeFileSync(bin, `#!/bin/sh\nexec "$(dirname "$(readlink -f "$0")")/${name}.bin" --no-sandbox "$@"\n`, { mode: 0o755 });
};
