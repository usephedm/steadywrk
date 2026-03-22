import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * GSD-2 Spec Parser
 * Synchronizes `.md` product specs with Linear issues and Notion databases.
 */
async function syncSpecs() {
  const specDir = path.join(process.cwd(), 'specs');

  try {
    await fs.mkdir(specDir, { recursive: true });
    const files = await fs.readdir(specDir);

    console.log(`[GSD-2] Found ${files.length} specs to sync.`);

    // In a full implementation, this would parse markdown frontmatter and
    // sync via Linear/Notion APIs. For now, it scaffolds the process.
    for (const file of files) {
      if (file.endsWith('.md')) {
        console.log(`[GSD-2] Validating spec: ${file}`);
      }
    }
  } catch (error) {
    console.error('[GSD-2] Sync failed:', error);
  }
}

syncSpecs();
