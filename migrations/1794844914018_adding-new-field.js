export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE posts
    ADD COLUMN queued_at TIMESTAMPTZ;

    ALTER TABLE likes
    ADD COLUMN queued_at TIMESTAMPTZ;

    ALTER TABLE reposts
    ADD COLUMN queued_at TIMESTAMPTZ;
    `)
}

export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE posts DROP COLUMN queued_at;

    ALTER TABLE likes DROP COLUMN queued_at;

    ALTER TABLE reposts DROP COLUMN queued_at;
    `)
}
