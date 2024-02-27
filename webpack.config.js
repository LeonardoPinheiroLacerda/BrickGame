const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.wav$/,
                loader: 'file-loader',
                options: {
                    name: 'sounds/[name].[ext]',
                },
            },
            {
                test: /\.png$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]',
                },
            },
            {
                test: /favicon\.ico$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css', '.wav', '.png', '.ico'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: 'body',
        }),
        new MiniCssExtractPlugin({
            filename: 'theme.css',
        }),
    ],
};
