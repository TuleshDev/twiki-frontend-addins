const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const fs = require('fs-extra')
const yargs = require('yargs').argv
const _ = require('lodash')

const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin')
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

const babelConfig = fs.readJsonSync(path.join(process.cwd(), '.babelrc'))
const cacheDir = '.webpack-cache/cache'
const babelDir = path.join(process.cwd(), '.webpack-cache/babel')

process.noDeprecation = true

fs.emptyDirSync(path.join(process.cwd(), 'assets'))

var config = {
  mode: 'development',
  output: {
    path: path.join(process.cwd(), 'assets'),
    publicPath: '/_assets/',
    libraryTarget: 'umd',
    library: 'twiki-frontend-addins',
    umdNamedDefine: true
  },
  externals: {
    vue: 'vue',
    'vue-router': 'vue-router',
    'vuetify/lib': 'vuetify/lib',
    'vuetify/lib/components/VDivider': 'vuetify/lib/components/VDivider',
    'vuetify/lib/components/VTooltip': 'vuetify/lib/components/VTooltip',
    'vuetify/lib/components/VBtn': 'vuetify/lib/components/VBtn',
    'vuetify/lib/components/VSwitch': 'vuetify/lib/components/VSwitch',
    'vuetify/lib/components/VIcon': 'vuetify/lib/components/VIcon',
    'vuetify/lib/components/VList': 'vuetify/lib/components/VList',
    'vuetify/lib/components/VSubheader': 'vuetify/lib/components/VSubheader',
    'vuetify/lib/components/VTreeview': 'vuetify/lib/components/VTreeview',
    'vuex-pathify': 'vuex-pathify',
    'lodash': 'lodash'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: (modulePath) => {
          return modulePath.includes('node_modules') && !modulePath.includes('vuetify')
        },
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: cacheDir
            }
          },
          {
            loader: 'babel-loader',
            options: {
              ...babelConfig,
              cacheDirectory: babelDir
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: cacheDir
            }
          },
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: false,
              sassOptions: {
                fiber: false
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: cacheDir
            }
          },
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: false,
              sassOptions: {
                fiber: false
              }
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.join(process.cwd(), '/client/scss/global.scss')
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.pug$/,
        exclude: [
          path.join(process.cwd(), 'dev')
        ],
        loader: 'pug-plain-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        exclude: [
          path.join(process.cwd(), 'node_modules/grapesjs')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'svg/'
            }
          }
        ]
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'graphql-persisted-document-loader' },
          { loader: 'graphql-tag/loader' }
        ]
      },
      {
        test: /\.(woff2|woff|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        loader: 'webpack-modernizr-loader',
        test: /\.modernizrrc\.js$/
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new MomentTimezoneDataPlugin({
      startYear: 2017,
      endYear: (new Date().getFullYear()) + 5
    }),
    new HtmlWebpackPugPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.CURRENT_THEME': JSON.stringify(_.defaultTo(yargs.theme, 'default'))
    }),
    new WriteFilePlugin(),
    new webpack.WatchIgnorePlugin([
      /node_modules/
    ])
  ],
  optimization: {
    namedModules: true,
    namedChunks: true,
    splitChunks: {
      //chunks: 'all'
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          test: /[\\/]node_modules[\\/](?![\\/]node_modules[\\/]style-loader[\\/])(?![\\/]node_modules[\\/]css-loader[\\/])/,
          minChunks: 2,
          priority: -10
        }
      }
    },
    runtimeChunk: false
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    symlinks: true,
    alias: {
      '@': path.join(process.cwd(), 'client'),
      'vue$': 'vue/dist/vue.esm.js',
      'gql': path.join(process.cwd(), 'client/graph'),
      // Duplicates fixes:
      'apollo-link': path.join(process.cwd(), 'node_modules/apollo-link'),
      'apollo-utilities': path.join(process.cwd(), 'node_modules/apollo-utilities'),
      'uc.micro': path.join(process.cwd(), 'node_modules/uc.micro'),
      'modernizr$': path.resolve(process.cwd(), 'client/.modernizrrc.js')
    },
    extensions: [
      '.js',
      '.json',
      '.vue'
    ],
    modules: [
      'node_modules'
    ]
  },
  node: {
    fs: 'empty'
  },
  stats: {
    children: false,
    entrypoints: false
  },
  target: 'web',
  watch: true
}

module.exports = [
  merge(config, {
    entry: path.join(process.cwd(), './client/plugin.js'),
    output: {
      filename: 'twiki-frontend-addins.min.js'
    }
  }),
  merge(config, {
    entry: path.join(process.cwd(), './client/index.js'),
    output: {
      filename: 'twiki-frontend-addins.js'
    }
  })
]
