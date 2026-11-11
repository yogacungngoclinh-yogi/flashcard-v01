import { validateCatalog } from './content.js';
import { boundedArray, id, invariant, record, text, unique, VERSION } from './contracts.js';
/** Only content-relative paths. Origin selection remains the host app's job. */
export function safeAssetPath(path) {
  text(path, 'asset path', 500);
  invariant(!/[\\?#%\s:\u0000-\u001f\u007f]/u.test(path) && !path.startsWith('/'), 'asset path must be relative and unencoded');
  invariant(path.split('/').every(part => /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(part) && part !== '.' && part !== '..'), 'invalid asset path segment');
  invariant(/\.(png|jpg|jpeg|webp|avif|svg|mp3|ogg|wav|m4a)$/i.test(path), 'unsupported asset extension');
  return path;
}
export function validateAssetManifest(manifest) {
  record(manifest, 'manifest'); invariant(manifest.schemaVersion === VERSION, 'unsupported asset schemaVersion');
  boundedArray(manifest.assets, 'assets', 30000).forEach(asset => {
    record(asset, 'asset'); id(asset.id, 'asset ID'); safeAssetPath(asset.path);
    invariant(['image', 'audio'].includes(asset.type), 'asset type must be image or audio');
    if (asset.type === 'image') { text(asset.altEn, 'altEn', 500); text(asset.altVi, 'altVi', 500); }
    invariant(typeof asset.sha256 === 'string' && /^[a-f0-9]{64}$/.test(asset.sha256), 'sha256 must be lowercase hex');
    if (asset.type === 'image') invariant(/\.(png|jpg|jpeg|webp|avif|svg)$/i.test(asset.path), 'image file type mismatch');
    if (asset.type === 'audio') invariant(/\.(mp3|ogg|wav|m4a)$/i.test(asset.path), 'audio file type mismatch');
  });
  unique(manifest.assets.map(asset => asset.id), 'asset IDs');
  unique(manifest.assets.map(asset => asset.path.toLowerCase()), 'asset paths on case-insensitive filesystems');
  return manifest;
}
export function auditContentAssets(catalog, manifest) {
  validateCatalog(catalog); validateAssetManifest(manifest);
  const assets = new Map(manifest.assets.map(asset => [asset.id, asset]));
  const missing = []; const wrongTypes = [];
  for (const card of catalog.cards) for (const [field, type] of [['imageId', 'image'], ['audioId', 'audio']]) {
    if (card[field] == null) continue;
    const asset = assets.get(card[field]);
    if (!asset) missing.push({ cardId: card.id, assetId: card[field], type });
    else if (asset.type !== type) wrongTypes.push({ cardId: card.id, assetId: card[field], expected: type, actual: asset.type });
  }
  return { ok: missing.length === 0 && wrongTypes.length === 0, missing, wrongTypes };
}
