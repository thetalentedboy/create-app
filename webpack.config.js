import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { batchEntry, loaderGetEntryName, generateVersion } from './build/utils.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development'

export default async () => {
	const { entry, plugins } = await batchEntry()

	return {
		entry,
		output: {
			clean: true,
			path: path.resolve(__dirname, './dist'),
			filename: '[name]/assets/[chunkhash:16].js',
			publicPath: isDev ? '/assets/dev-template/' : '/assets/template/',
		},
		mode: 'production',
		resolve: {
			alias: {
				'@': path.join(__dirname, './src'),
			},
			extensions: ['.json', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.html$/,
					use: [
						{
							loader: 'html-loader',
							options: {
								sources: true,
								minimize: {
									caseSensitive: true,
									collapseWhitespace: true,
									conservativeCollapse: true,
									keepClosingSlash: true,
									minifyCSS: false,
									minifyJS: true,
									removeComments: true,
									removeRedundantAttributes: false,
									removeScriptTypeAttributes: true,
									removeStyleLinkTypeAttributes: true,
								}
							}
						}
					]
				},
				{
					test: /\.(png|svg|webp|jpg|jpeg|gif|mp4)$/i,
					type: 'asset/resource',
					generator: {
						filename: (pathData) => {
							return `${loaderGetEntryName(pathData.filename, 'template')}/assets/[name][ext][query]`;
						}
					}
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
					generator: {
						filename: (pathData) => {
							return `${loaderGetEntryName(pathData.filename, 'template')}/assets/[name][ext][query]`;
						}
					}
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.css$/i,
					use: [MiniCssExtractPlugin.loader, 'css-loader'],
				}
			],
		},
		plugins: [
			...plugins,
			new MiniCssExtractPlugin({
				filename: `[name]/assets/[chunkhash:16].css`,
				linkType: 'text/css',
			}),
		],
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin(),
				new CssMinimizerPlugin(),
				new WebpackManifestPlugin({
					generate: generateVersion
				})],
		}
	};
}


