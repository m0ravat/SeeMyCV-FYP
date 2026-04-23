CREATE TABLE IF NOT EXISTS user_cvs (
  id          SERIAL PRIMARY KEY,
  profile_id  INTEGER NOT NULL REFERENCES profile(profile_id) ON DELETE CASCADE,
  format_id   BIGINT  NOT NULL REFERENCES cvformats(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'draft',  -- draft | published
  open_for_feedback BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
