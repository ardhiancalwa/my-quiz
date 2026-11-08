BEGIN;
INSERT INTO categories(id,name) VALUES ('test','Test');
INSERT INTO topics(id,category_id,name) VALUES ('test-topic','test','Test topic');
INSERT INTO question_sources(id,description,license) VALUES ('test-source','Original test','Test only');
INSERT INTO questions(id,topic_id,source_id,ordinal,difficulty,version,status,document) VALUES ('test-question','test-topic','test-source',1,'medium',1,'draft','{}');
DO $$ BEGIN
 BEGIN
  UPDATE questions SET status='published' WHERE id='test-question';
  RAISE EXCEPTION 'Publishing unreviewed content unexpectedly succeeded';
 EXCEPTION WHEN check_violation THEN NULL; END;
 BEGIN
  INSERT INTO question_options(question_id,label,body) VALUES ('unknown','A','Invalid foreign key');
  RAISE EXCEPTION 'Foreign key unexpectedly succeeded';
 EXCEPTION WHEN foreign_key_violation THEN NULL; END;
 BEGIN
  INSERT INTO question_options(question_id,label,body) VALUES ('test-question','E','Invalid option');
  RAISE EXCEPTION 'Invalid option unexpectedly succeeded';
 EXCEPTION WHEN check_violation THEN NULL; END;
END $$;
ROLLBACK;
