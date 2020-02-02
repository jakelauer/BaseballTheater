declare const __PRODUCTION__: boolean;

const prodStatus = typeof __PRODUCTION__ !== "undefined" ? __PRODUCTION__ : false;

export const isProd = !!prodStatus;