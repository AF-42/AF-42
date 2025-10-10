import tidy from 'eslint-config-tidy';

export default [
	...tidy,
	{
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'import/extensions': 'off',
			'import/no-unresolved': 'off',
			'node/no-missing-import': 'off',
		},
	},
];
