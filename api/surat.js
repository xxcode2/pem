const { getDb } = require('./db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    try {
        if (req.method === 'GET') {
            const search = req.query.search || '';
            let rows;
            if (search) {
                const searchPattern = `%${search}%`;
                rows = await sql`
                    SELECT * FROM surat_history
                    WHERE LOWER(nama) LIKE LOWER(${searchPattern})
                    ORDER BY created_at DESC
                `;
            } else {
                rows = await sql`SELECT * FROM surat_history ORDER BY created_at DESC`;
            }
            const records = rows.map(row => ({
                id: row.id,
                tanggal: row.tanggal,
                jenis: row.jenis,
                nama: row.nama,
                nik: row.nik || '',
                noSurat: row.no_surat || '',
                data: row.form_data,
                timestamp: row.created_at
            }));
            return res.status(200).json(records);
        }

        if (req.method === 'POST') {
            const body = req.body;
            const { tanggal, jenis, nama, nik, noSurat, data } = body;

            if (!jenis || !nama) {
                return res.status(400).json({ error: 'Missing required fields: jenis, nama' });
            }

            const rows = await sql`
                INSERT INTO surat_history (tanggal, jenis, nama, nik, no_surat, form_data)
                VALUES (${tanggal || null}, ${jenis}, ${nama}, ${nik || ''}, ${noSurat || ''}, ${JSON.stringify(data || {})})
                RETURNING id, created_at
            `;
            return res.status(201).json({
                success: true,
                id: rows[0].id,
                created_at: rows[0].created_at
            });
        }

        if (req.method === 'DELETE') {
            const { id, all } = req.query;

            if (all === 'true') {
                await sql`DELETE FROM surat_history`;
                return res.status(200).json({ success: true, message: 'All records deleted' });
            }

            if (id) {
                const parsedId = parseInt(id);
                if (isNaN(parsedId)) {
                    return res.status(400).json({ error: 'Invalid id parameter' });
                }
                await sql`DELETE FROM surat_history WHERE id = ${parsedId}`;
                return res.status(200).json({ success: true });
            }

            return res.status(400).json({ error: 'Provide id or all=true parameter' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Surat API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
