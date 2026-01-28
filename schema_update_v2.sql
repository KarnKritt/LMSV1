
-- Update Lesson Progress for granular tracking
alter table lesson_progress add column video_watched boolean default false;
alter table lesson_progress add column quiz_passed boolean default false;

-- We will treat 'is_completed' as the final unlock boolean.
-- Logic: is_completed = video_watched AND (quiz_passed OR no_quiz_exists)
