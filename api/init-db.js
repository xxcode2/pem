const { getDb } = require('./db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS settings (
                id SERIAL PRIMARY KEY,
                desa TEXT,
                kecamatan TEXT,
                kabupaten TEXT,
                provinsi TEXT,
                kode_pos TEXT,
                alamat TEXT,
                kades TEXT,
                nip_kades TEXT,
                sekdes TEXT,
                nip_sekdes TEXT,
                logo_kades TEXT,
                logo_sekdes TEXT,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS surat_history (
                id SERIAL PRIMARY KEY,
                tanggal DATE,
                jenis TEXT NOT NULL,
                nama TEXT NOT NULL,
                nik TEXT,
                no_surat TEXT,
                form_data JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;

        await sql`
            INSERT INTO settings (id, desa, kecamatan, kabupaten, provinsi, kode_pos, alamat)
            VALUES (1, 'Kasomalang Kulon', 'Kasomalang', 'Subang', 'Jawa Barat', '41281', 'Jl. Raya Kasomalang No.01')
            ON CONFLICT (id) DO NOTHING
        `;

        return res.status(200).json({ success: true, message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Init DB error:', error);
        return res.status(500).json({ error: 'Failed to initialize database', details: error.message });
    }
};
