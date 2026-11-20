export const up = (pgm)=>{

  pgm.sql(`
  CREATE TABLE users(
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      account_id TEXT NOT NULL UNIQUE
      );

  CREATE TABLE posts(
    post_uri TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    post_text TEXT,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ,
    record_key TEXT NOT NULL,
    postgres_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mongodb_synced_at TIMESTAMPTZ,

    CONSTRAINT unique_post
    UNIQUE(user_id, record_key)
  );

  CREATE TABLE likes(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    target_post_uri TEXT NOT NULL REFERENCES posts(post_uri),
    record_key TEXT NOT NULL,
    created_at TIMESTAMPTZ,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    postgres_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mongodb_synced_at TIMESTAMPTZ,

    CONSTRAINT unique_like
    UNIQUE(user_id, record_key)
  );

  CREATE TABLE reposts(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    target_post_uri TEXT NOT NULL REFERENCES posts(post_uri),
    record_key TEXT NOT NULL,
    created_at TIMESTAMPTZ,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    postgres_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mongodb_synced_at TIMESTAMPTZ,

    CONSTRAINT unique_repost
    UNIQUE(user_id, record_key)
  );

  CREATE TABLE sync_state(
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK(id=1),
    last_cursor BIGINT NOT NULL,
    postgres_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE jetstream_events(
     id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     user_id BIGINT NOT NULL REFERENCES users(id),
     cursor BIGINT NOT NULL UNIQUE,
     event_time TIMESTAMPTZ NOT NULL,
     event_type TEXT NOT NULL,
     collection_name TEXT,
     operation TEXT,
     record_key TEXT,
     event_data JSONB NOT NULL 
  );
     `)
};

export const down = (pgm)=>{
  pgm.sql(`
    DROP TABLE jetstream_events;
    DROP TABLE sync_state;
    DROP TABLE reposts;
    DROP TABLE likes;
    DROP TABLE posts;
    DROP TABLE users;
`)};