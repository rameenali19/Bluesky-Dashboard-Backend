export interface PostArr {
  user_id: string,
  post_uri: string;
  post_text: string,
  record_key: string,
  created_at: Date
}

export interface UserArr {
  id: string,
}

export interface LikeArr {
  user_id: string,
  target_post_uri: string,
  record_key: string,
  created_at: Date
}

export interface RepostArr {
  user_id: string,
  target_post_uri: string,
  record_key: string,
  created_at: Date
}

export interface CursorArr {
  last_cursor: number
}

export interface HistoryArr {
  user_id: string,
  cursor: number,
  event_time: Date,
  event_type: string,
  collection_name: string,
  operation: string,
  record_key: string,
  event_data: string
}