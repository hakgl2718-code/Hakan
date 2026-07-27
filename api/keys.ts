let inMemoryKeys: string[] = [];

export function getStoredServerKeys(): string[] {
  return inMemoryKeys.filter((k) => typeof k === 'string' && k.trim().length > 0);
}

export function setStoredServerKeys(keys: string[]) {
  if (Array.isArray(keys)) {
    inMemoryKeys = keys.map((k) => String(k).trim()).filter((k) => k.length > 0);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { keys } = req.body || {};
    if (Array.isArray(keys)) {
      setStoredServerKeys(keys);
      return res.status(200).json({ success: true, count: inMemoryKeys.length });
    }
    return res.status(400).json({ error: 'Geçersiz anahtar listesi' });
  }

  if (req.method === 'GET') {
    // Return key status without exposing actual keys
    return res.status(200).json({
      keyCount: inMemoryKeys.length,
      status: inMemoryKeys.length > 0 ? 'active' : 'idle',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
