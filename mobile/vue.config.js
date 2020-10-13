module.exports = {
    publicPath: process.env.NODE_ENV == 'production'
        ? '/mobile/'
        : '/',
    outputDir: '../docs'
}