import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	serverExternalPackages: ['@mastra/*'],
	experimental: {
		turbo: {
			rules: {
				'*.LICENSE': {
					loaders: ['ignore-loader'],
				},
				'**/LICENSE': {
					loaders: ['ignore-loader'],
				},
				'**/LICENSE.txt': {
					loaders: ['ignore-loader'],
				},
				'**/LICENSE.md': {
					loaders: ['ignore-loader'],
				},
				'**/README.md': {
					loaders: ['ignore-loader'],
				},
				'**/README.txt': {
					loaders: ['ignore-loader'],
				},
				'**/CHANGELOG.md': {
					loaders: ['ignore-loader'],
				},
				'**/CHANGELOG.txt': {
					loaders: ['ignore-loader'],
				},
			},
		},
	},
};

export default nextConfig;
