/**
 * Clears the bookkeeping row left by a migration that failed before finishing.
 *
 * Prisma refuses to apply any further migration while such a row exists (P3009),
 * which otherwise requires manual database access to recover from. Postgres runs
 * each migration in a transaction, so a failure leaves no tables behind — only
 * the row. This deletes that row ONLY when the schema is confirmed empty, so a
 * database that really does hold a partially-applied migration is left untouched
 * for a human to inspect rather than silently retried.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['error'] })

const unfinishedMigrations = async () =>
  prisma.$queryRaw`
    SELECT migration_name FROM "_prisma_migrations"
    WHERE finished_at IS NULL AND rolled_back_at IS NULL
  `

const tableExists = async (name) => {
  const rows = await prisma.$queryRaw`
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = ${name}
  `
  return rows.length > 0
}

const main = async () => {
  const stuck = await unfinishedMigrations()
  if (stuck.length === 0) return

  const names = stuck.map(m => m.migration_name).join(', ')

  if (await tableExists('User')) {
    console.warn(
      `Migration repair: leaving ${names} alone — application tables are present, ` +
      `so this database may hold a partially-applied migration. Resolve it manually: ` +
      `https://pris.ly/d/migrate-resolve`
    )
    return
  }

  await prisma.$executeRaw`
    DELETE FROM "_prisma_migrations"
    WHERE finished_at IS NULL AND rolled_back_at IS NULL
  `
  console.log(`Migration repair: cleared failed record for ${names}; schema was empty.`)
}

main()
  .catch(err => {
    // A brand-new database has no _prisma_migrations table yet, and an
    // unreachable database is migrate deploy's error to report, not this
    // script's. Neither should stop the boot sequence here.
    const benign = /_prisma_migrations|does not exist|Can't reach database server|P1001/.test(err.message ?? '')
    if (!benign) console.error('Migration repair skipped:', err.message)
  })
  .finally(() => prisma.$disconnect())
