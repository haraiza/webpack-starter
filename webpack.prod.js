const HtmlWebPackPlugin    = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin           = require('copy-webpack-plugin');

const CssMinimizer         = require('css-minimizer-webpack-plugin');
const Terser               = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',

    output: {
        clean: true, // ! Cuando esta esta opcion, hace que al correr el build 
                     // ! se borre el build anterior antes de crear el nuevo
        filename: 'main.[contenthash].js'
    },

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizer(),
            new Terser(),
        ]
    },

    module: {
        rules: [{

            // ! IMPORTANTE: Las reglas se aplican de arriba hacia abajo. Si la primera regla 
            // ! es valida, entonces no seguira revisando el resto de las reglas para el archivo.

            // *Esta regla es para decir que si el nombre del archivo termina con html, 
            // *entonces aplique esta regla
            test: /\.html$/i,
            loader: 'html-loader',
            options: {
                sources: false,
                minimize: false, // ! Si fuera true, quitaria los comentarios
            },
        },
        {
            // *Esta regla es para decir que si el nombre del archivo termina con css, 
            // *entonces aplique esta regla pero que no la aplique a styles.css
            test: /\.css$/,
            exclude: /styles.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            // *Esta regla es para decir que si el nombre del archivo es 'styles.css', 
            // *entonces aplique esta regla. Esto hara que el CSS este disponible de forma global
            // *y no como en el caso de la regla anterior que integra el css al codigo html y js
            test: /styles.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
            // *Esta regla es para decir que si el nombre del archivo es termina con 
            //* .png, .jpe, jpeg o .gif entonces aplique esta regla. 
            test: /\.(png|jpe?g|gif)$/,
            loader: 'file-loader'
        },
        {
            // *Esta regla es para que babel pueda 'traducir' a estandares viejos el js. Esto es para 
            // *aumentar la retrocompatibilidad del codigo con navegadores viejos 
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env']
              }
            }
        }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            title: 'My Title',
            template: './src/index.html',
            filename: './index.html', // ! Aqui va el nombre que tendra el nuevo archivo con todo integrado
        }),

        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css',
            ignoreOrder: false,
        }),

        new CopyPlugin({
            patterns: [
                { from: 'src/assets/', to: 'assets/' }
            ]
        })
    ]
}

