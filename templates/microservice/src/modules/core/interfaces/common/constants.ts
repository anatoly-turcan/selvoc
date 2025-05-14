const name = process.env.npm_package_name || 'unknown';
const version = process.env.npm_package_version || '0.0.0';

export const APP_NAME = name.split('/')[1].replace('-service', '');
export const APP_VERSION = version;
