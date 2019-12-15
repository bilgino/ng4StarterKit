const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATH = require('path');

module.exports = {

    target : 'web',

    devtool: false,

    context : PATH.resolve(__dirname, 'src'),

    entry : {
        'polyfills': './polyfills.ts',
        'app': './app/main/bootstrap-aot.ts'
    },

    output: {
        path : PATH.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js',
        //chunkFilename: '[id].chunk.js'
        //sourceMapFilename: '[file].map'
    },

    devServer : {
        stats: 'minimal',
        port: 8080,
        host: "localhost",
        inline: true,
        noInfo: true,
        publicPath: '/',
        historyApiFallback: {
            compress : true,
            index : '/index.html',
            rewrites: [
                { from: /\/favicon.ico/, to: './assets/icons/favicon.ico' },
                { from: /\/index/,   to: '/index.html'},
                { from: /\/about/,   to: '/about.html'},
                { from: /\/contact/, to: '/contact.html'},
                { from: /^[^]+$/,    to: '/error.html'}
            ],
           // disableDotRule: false
        },
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    },

    resolve: {
        extensions: ['.ts', '.js', '.jpg', '.jpeg', '.gif', '.png', '.html', '.css'],
        modules: [PATH.resolve(__dirname), 'node_modules']
    },

    module: {
        rules: [
            // {
            //  test: /\.ts$/,
            //  use: ["source-map-loader"],
            //  enforce: "pre"
            // },
            // {
            //  test: /\.ts$/,
            //  enforce: 'pre',
            //  loader: 'tslint-loader',
            //  options: { /* Loader options go here */ }
            // },
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            // {
            //     test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            //     loader: 'file-loader?name=assets/[name].[ext]'
            // },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.css$/,
                use: 'raw-loader',
                include : PATH.resolve(__dirname,'src', 'app')
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
               // exclude: PATH.resolve(__dirname, 'src', 'app') ???
            }
        ]
    },
    plugins: [

        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            PATH.resolve(__dirname, 'src'),
            {}
        ),

        new webpack.DefinePlugin({
            'process.env': {
                'ENVIRONMENT': JSON.stringify('development')
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'polyfills']
        }),

        new CleanWebpackPlugin("dist", {
            root: __dirname
        }),

        new ExtractTextPlugin("[name].[contenthash].css"),

        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            sourceMap: false,
            compress: {
                warnings: false
            },
            comments : false,
            mangle: {
                keep_fnames: true
            }
        }),

        new HtmlWebpackPlugin({
            title : 'index',
            filename : 'index.html',
            template: './pages/index.ejs',
            chunks: ['polyfills', 'app'],
            baseUrl: '/app/'
            //chunksSortMode: 'dependency'
        }),

        new HtmlWebpackPlugin({
            title : 'about',
            filename : 'about.html',
            template: './pages/about.ejs',
            chunks: ['polyfills', 'app']
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options : {
                htmlLoader: {
                    minimize: false, // workaround for ng2
                    caseSensitive: true
                }
            }
        }),

        new CopyWebpackPlugin([
            {
                from: './assets/icons/favicon.ico',
                to: 'assets/icons/[name].[ext]'
            }
        ],{
            copyUnmodified: true
        })
    ]
};
