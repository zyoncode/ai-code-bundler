#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import { bundleCode } from './index.js';

yargs(hideBin(process.argv))
  .command('$0 [path]', 'Bundle code for AI learning', (yargs) => {
    return yargs
      .positional('path', {
        describe: 'Path to the code repository',
        default: process.cwd(),
        type: 'string',
      })
      .option('output', {
        alias: 'o',
        describe: 'Output directory for bundled files',
        default: 'bundled_output',
        type: 'string',
      })
      .option('extensions', {
        alias: 'e',
        describe: 'Allowed file extensions',
        default: ['.js', '.ts', '.tsx', '.css', '.json'],
        type: 'array',
      })
      .option('maxFiles', {
        alias: 'm',
        describe: 'Maximum number of output files',
        default: 5,
        type: 'number',
      })
      .option('maxFileSize', {
        alias: 's',
        describe: 'Maximum size of each output file in MB',
        default: 30,
        type: 'number',
      })
      .option('ignoreGitignore', {
        alias: 'i',
        describe: 'Ignore .gitignore rules',
        type: 'boolean',
      });
  }, (argv) => {
    const options = {
      repoPath: path.resolve(argv.path as string),
      outputDir: path.resolve(argv.output as string),
      allowedExtensions: argv.extensions as string[],
      maxFiles: argv.maxFiles as number,
      maxFileSize: (argv.maxFileSize as number) * 1024 * 1024, // Convert MB to bytes
      useGitignore: !argv.ignoreGitignore,
    };

    bundleCode(options);
  })
  .help()
  .argv;