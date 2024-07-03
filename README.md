# AI Code Bundler (acb)

AI Code Bundler is a tool designed to bundle your code into a format suitable for AI learning, specifically for AI models that support file uploads like Claude.

## Installation

You can install AI Code Bundler globally using npm:

```bash
npm install -g ai-code-bundler
```

Or you can use it directly with npx:

```bash
npx ai-code-bundler
```

## Usage

The basic command is `acb`:

```bash
acb [path] [options]
```

If no path is specified, it will use the current directory.

### Options

- `--output`, `-o`: Output directory for bundled files (default: 'bundled_output')
- `--extensions`, `-e`: Allowed file extensions (default: .js, .ts, .tsx, .css, .json)
- `--maxFiles`, `-m`: Maximum number of output files (default: 5)
- `--maxFileSize`, `-s`: Maximum size of each output file in MB (default: 30)
- `--ignoreGitignore`, `-i`: Ignore .gitignore rules (by default, .gitignore rules are followed)

### Examples

Bundle the current directory:

```bash
acb
```

Bundle a specific directory with custom options:

```bash
acb /path/to/your/code -o bundled -e .js .ts -m 3 -s 20 -i
```

This will bundle the code in `/path/to/your/code`, output to a 'bundled' directory, only include .js and .ts files, create a maximum of 3 files, each with a maximum size of 20MB, and ignore .gitignore rules.

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run locally: `node dist/cli.js`

### Making Changes

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

1. Make your changes
2. Run `npm run changeset` to create a new changeset
3. Commit the changeset along with your changes
4. When ready to release, run `npm run version` to update versions and changelogs
5. Run `npm run release` to publish the new version

## License

This project is licensed under the MIT License.