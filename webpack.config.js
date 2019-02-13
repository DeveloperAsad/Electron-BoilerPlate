const path = require('path');

module.exports = {
    target: 'electron-renderer',
    entry: __dirname + '/src/js/index.js',
    output: {
        path: __dirname + '/build/js',
        filename: 'index.js'
    },
    devtool :  'source-map',
    module: {
        rules: [{
            test: /.js$/,
            include: path.resolve(__dirname, 'src/js'),
            exclude: path.resolve(__dirname, 'node_modules'),
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-react'],
                plugins: [
                    '@babel/plugin-proposal-class-properties'
                ]
            }
        }]
    },
    resolve : {
        extensions : ['.js']
    }
}