// normalizeID strips all spaces and converts all characters to lowercase
// so IDs are stored in a consistent, case-insensitive fashion
function normalizeID(dirtyID: string): string {
  return dirtyID.toLowerCase().replace(/\s+/g, '');
}

function forceAlphanumeric(str: string): string {
  return str.replace(/[^A-Za-z0-9]/g, '');
}

export {normalizeID, forceAlphanumeric};
