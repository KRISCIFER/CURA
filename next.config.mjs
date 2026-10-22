import {fileURLToPath} from 'node:url';
export default { output: 'export', outputFileTracingRoot: fileURLToPath(new URL('.',import.meta.url)), trailingSlash: true, images: { unoptimized: true } };
