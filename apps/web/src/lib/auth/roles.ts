export function hasAdminAccess(publicMetadata: unknown): boolean {
  if (!publicMetadata || typeof publicMetadata !== 'object') {
    return false;
  }

  const metadata = publicMetadata as {
    role?: unknown;
    roles?: unknown;
    isAdmin?: unknown;
  };

  if (metadata.isAdmin === true) {
    return true;
  }

  if (metadata.role === 'admin') {
    return true;
  }

  if (Array.isArray(metadata.roles) && metadata.roles.includes('admin')) {
    return true;
  }

  return false;
}
