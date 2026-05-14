const { getDb, ensureTablesExist } = require('./db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    try {
        await ensureTablesExist();
        if (req.method === 'GET') {
            const rows = await sql`SELECT * FROM settings WHERE id = 1`;
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Settings not found' });
            }
            const row = rows[0];
            const settings = {
                desa: row.desa || '',
                kecamatan: row.kecamatan || '',
                kabupaten: row.kabupaten || '',
                provinsi: row.provinsi || '',
                kodePos: row.kode_pos || '',
                alamat: row.alamat || '',
                kades: row.kades || '',
                nipKades: row.nip_kades || '',
                sekdes: row.sekdes || '',
                nipSekdes: row.nip_sekdes || '',
                logoKades: row.logo_kades || '',
                logoSekdes: row.logo_sekdes || ''
            };
            return res.status(200).json(settings);
        }

        if (req.method === 'POST') {
            const body = req.body;
            const {
                desa, kecamatan, kabupaten, provinsi, kodePos,
                alamat, kades, nipKades, sekdes, nipSekdes,
                logoKades, logoSekdes
            } = body;

            await sql`
                INSERT INTO settings (id, desa, kecamatan, kabupaten, provinsi, kode_pos, alamat, kades, nip_kades, sekdes, nip_sekdes, logo_kades, logo_sekdes, updated_at)
                VALUES (1, ${desa || ''}, ${kecamatan || ''}, ${kabupaten || ''}, ${provinsi || ''}, ${kodePos || ''}, ${alamat || ''}, ${kades || ''}, ${nipKades || ''}, ${sekdes || ''}, ${nipSekdes || ''}, ${logoKades || ''}, ${logoSekdes || ''}, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    desa = EXCLUDED.desa,
                    kecamatan = EXCLUDED.kecamatan,
                    kabupaten = EXCLUDED.kabupaten,
                    provinsi = EXCLUDED.provinsi,
                    kode_pos = EXCLUDED.kode_pos,
                    alamat = EXCLUDED.alamat,
                    kades = EXCLUDED.kades,
                    nip_kades = EXCLUDED.nip_kades,
                    sekdes = EXCLUDED.sekdes,
                    nip_sekdes = EXCLUDED.nip_sekdes,
                    logo_kades = EXCLUDED.logo_kades,
                    logo_sekdes = EXCLUDED.logo_sekdes,
                    updated_at = NOW()
            `;
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Settings API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
