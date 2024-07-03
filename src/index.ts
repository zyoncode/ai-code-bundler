import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

interface BundleOptions {
  repoPath: string;
  outputDir: string;
  allowedExtensions: string[];
  maxFiles: number;
  maxFileSize: number;
  useGitignore: boolean;
}

function readGitignore(repoPath: string): ReturnType<typeof ignore> {
  const gitignorePath = path.join(repoPath, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    return ignore().add(gitignoreContent);
  }
  return ignore();
}

function isHidden(filePath: string): boolean {
  return path.basename(filePath).startsWith('.');
}

function isAllowedFileType(filePath: string, allowedExtensions: string[]): boolean {
  return allowedExtensions.includes(path.extname(filePath).toLowerCase());
}

function walkDirectory(dir: string, ig: ReturnType<typeof ignore>, baseDir: string, allowedExtensions: string[]): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(baseDir, fullPath);

    if (stat && stat.isDirectory()) {
      if (!isHidden(fullPath) && !ig.ignores(relativePath)) {
        results = results.concat(walkDirectory(fullPath, ig, baseDir, allowedExtensions));
      }
    } else {
      if (!isHidden(fullPath) && !ig.ignores(relativePath) && isAllowedFileType(fullPath, allowedExtensions)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

export function bundleCode(options: BundleOptions): void {
  const {
    repoPath,
    outputDir,
    allowedExtensions,
    maxFiles,
    maxFileSize,
    useGitignore
  } = options;

  const ig = useGitignore ? readGitignore(repoPath) : ignore();
  const files = walkDirectory(repoPath, ig, repoPath, allowedExtensions);

  let currentFileContent = '';
  let currentFileNumber = 1;
  let bundledFiles: string[] = [];

  for (const file of files) {
    const relativePath = path.relative(repoPath, file);
    const content = fs.readFileSync(file, 'utf8');
    const fileContent = `// ${relativePath}\n${content}\n\n`;

    if (currentFileNumber > maxFiles || Buffer.byteLength(fileContent, 'utf8') > maxFileSize) {
      console.log(`Skipping file ${relativePath}: exceeds size limit or max file count reached`);
      continue;
    }

    if (Buffer.byteLength(currentFileContent + fileContent, 'utf8') > maxFileSize) {
      if (currentFileContent) {
        bundledFiles.push(currentFileContent);
        currentFileContent = '';
        currentFileNumber++;
      }
      
      if (currentFileNumber > maxFiles) {
        console.log(`Reached max file count. Skipping remaining files.`);
        break;
      }
    }

    currentFileContent += fileContent;
  }

  if (currentFileContent) {
    bundledFiles.push(currentFileContent);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  bundledFiles.forEach((content, index) => {
    const outputPath = path.join(outputDir, `bundled_${index + 1}.txt`);
    fs.writeFileSync(outputPath, content);
  });

  console.log(`Bundled ${files.length} files into ${bundledFiles.length} output files.`);
}