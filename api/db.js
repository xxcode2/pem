const { neon } = require('@neondatabase/serverless');

let sql;
let initialized = false;

function getDb() {
    if (!sql) {
        sql = neon(process.env.DATABASE_URL);
    }
    return sql;
}

async function ensureTablesExist() {
    if (initialized) return;
    const db = getDb();
    await db`
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
    await db`
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
    await db`
        INSERT INTO settings (id, desa, kecamatan, kabupaten, provinsi, kode_pos, alamat)
        VALUES (1, 'Kasomalang Kulon', 'Kasomalang', 'Subang', 'Jawa Barat', '41281', 'Jl. Raya Kasomalang No.01')
        ON CONFLICT (id) DO NOTHING
    `;
    initialized = true;
}

module.exports = { getDb, ensureTablesExist };
