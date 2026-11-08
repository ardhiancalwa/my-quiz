CREATE TABLE IF NOT EXISTS categories (id text PRIMARY KEY, name text NOT NULL);
CREATE TABLE IF NOT EXISTS topics (id text PRIMARY KEY, category_id text NOT NULL REFERENCES categories(id), name text NOT NULL, UNIQUE(category_id,name));
CREATE TABLE IF NOT EXISTS passages (id text PRIMARY KEY, title text NOT NULL, body text NOT NULL);
CREATE TABLE IF NOT EXISTS audio_assets (id text PRIMARY KEY, url text NOT NULL, transcript text NOT NULL, kind text NOT NULL);
CREATE TABLE IF NOT EXISTS question_sources (id text PRIMARY KEY, description text NOT NULL, license text NOT NULL);
CREATE TABLE IF NOT EXISTS questions (
 id text PRIMARY KEY, topic_id text NOT NULL REFERENCES topics(id), passage_id text REFERENCES passages(id), audio_id text REFERENCES audio_assets(id), source_id text NOT NULL REFERENCES question_sources(id),
 ordinal integer NOT NULL, difficulty text NOT NULL CHECK (difficulty IN ('easy','medium','hard')), version integer NOT NULL CHECK(version>0),
 status text NOT NULL CHECK(status IN ('draft','validated','published')), reviewed_by text, reviewed_at timestamptz,
 document jsonb NOT NULL, CHECK (status='draft' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS questions_filter ON questions(status,topic_id,difficulty,ordinal);
CREATE TABLE IF NOT EXISTS question_options (question_id text NOT NULL REFERENCES questions(id) ON DELETE CASCADE, label char(1) NOT NULL CHECK(label IN ('A','B','C','D')), body text NOT NULL, PRIMARY KEY(question_id,label));
CREATE TABLE IF NOT EXISTS answer_explanations (question_id text PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE, correct char(1) NOT NULL CHECK(correct IN ('A','B','C','D')), document jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS exam_packages (id text PRIMARY KEY,name text NOT NULL,status text NOT NULL CHECK(status IN ('draft','published')));
CREATE TABLE IF NOT EXISTS exam_package_questions (package_id text NOT NULL REFERENCES exam_packages(id), question_id text NOT NULL REFERENCES questions(id), ordinal integer NOT NULL, PRIMARY KEY(package_id,question_id),UNIQUE(package_id,ordinal));
