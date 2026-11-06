
export const up = (pgm) => {
  // USERS
  pgm.createTable('users', {
    id: {
      type: 'bigint',
      primaryKey: true,
      generated: 'ALWAYS',
      identity: true,
    },
    account_id: {
      type: 'text',
      notNull: true,
      unique: true,
    },
  });

  // POSTS
  pgm.createTable('posts', {
    id: {
      type: 'bigint',
      primaryKey: true,
      generated: 'ALWAYS',
      identity: true,
    },
    user_id: {
      type: 'bigint',
      notNull: true,
      references: 'users(id)',
    },
    post_text: {
      type: 'text',
    },
    post_uri: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    deleted: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    created_at: {
      type: 'timestamptz',
    },
    record_key: {
      type: 'text',
      notNull: true,
    },
    postgres_updated: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    mongodb_synced_at: {
      type: 'timestamptz',
    },
  });

  pgm.addConstraint('posts', 'posts_user_record_unique', {
    unique: ['user_id', 'record_key'],
  });

  // LIKES
  pgm.createTable('likes', {
    id: {
      type: 'bigint',
      primaryKey: true,
      generated: 'ALWAYS',
      identity: true,
    },
    user_id: {
      type: 'bigint',
      notNull: true,
      references: 'users(id)',
    },
    target_post_uri: {
      type: 'text',
      notNull: true,
    },
    record_key: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
    },
    deleted: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    postgres_updated: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    mongodb_synced_at: {
      type: 'timestamptz',
    },
  });

  pgm.addConstraint('likes', 'likes_user_record_unique', {
    unique: ['user_id', 'record_key'],
  });

  // REPOSTS
  pgm.createTable('reposts', {
    id: {
      type: 'bigint',
      primaryKey: true,
      generated: 'ALWAYS',
      identity: true,
    },
    user_id: {
      type: 'bigint',
      notNull: true,
      references: 'users(id)',
    },
    record_key: {
      type: 'text',
      notNull: true,
    },
    target_post_uri: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
    },
    deleted: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    postgres_updated: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    mongodb_synced_at: {
      type: 'timestamptz',
    },
  });

  pgm.addConstraint('reposts', 'reposts_user_record_unique', {
    unique: ['user_id', 'record_key'],
  });

  // SYNC STATE
  pgm.createTable('sync_state', {
    id: {
      type: 'integer',
      primaryKey: true,
      default: 1,
      check: 'id = 1',
    },
    last_cursor: {
      type: 'bigint',
      notNull: true,
    },
    postgres_updated: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.sql(`
    INSERT INTO sync_state (id, last_cursor)
    VALUES (1, 0);
  `);

  // JETSTREAM EVENTS
  pgm.createTable('jetstream_events', {
    id: {
      type: 'bigint',
      primaryKey: true,
      generated: 'ALWAYS',
      identity: true,
    },
    user_id: {
      type: 'bigint',
      notNull: true,
      references: 'users(id)',
    },
    cursor: {
      type: 'bigint',
      notNull: true,
      unique: true,
    },
    event_time: {
      type: 'timestamptz',
      notNull: true,
    },
    event_type: {
      type: 'text',
      notNull: true,
    },
    collection_name: {
      type: 'text',
    },
    operation: {
      type: 'text',
    },
    record_key: {
      type: 'text',
    },
    event_data: {
      type: 'jsonb',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  // Drop tables in reverse dependency order
  pgm.dropTable('jetstream_events');
  pgm.dropTable('sync_state');
  pgm.dropTable('reposts');
  pgm.dropTable('likes');
  pgm.dropTable('posts');
  pgm.dropTable('users');
};
