const plugins = process.env.NODE_ENV === 'production' ? [require('autoprefixer'), require('cssnano')] : [require('autoprefixer')]; // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
	plugins
};
