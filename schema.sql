-- Enable functionality for UUIDs
create extension if not exists "uuid-ossp";

-- 1. COURSES TABLE
create table courses (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price numeric default 0,
  tags text[] -- Array of tags e.g. ['Beginner', 'Grammar']
);

-- 2. LESSONS TABLE
create table lessons (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  video_url text, -- YouTube URL
  order_index integer not null -- To determine lesson sequence
);

-- 3. QUIZZES TABLE
-- Supports Pre-test, Lesson Quiz, Post-test
create type quiz_type as enum ('PRE_TEST', 'LESSON_QUIZ', 'POST_TEST');

create table quizzes (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  type quiz_type not null,
  related_lesson_id uuid references lessons(id) on delete cascade, -- Null for Pre/Post tests
  title text not null
);

-- 4. QUESTIONS TABLE
create table questions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  quiz_id uuid references quizzes(id) on delete cascade not null,
  text text not null,
  options jsonb not null, -- e.g. [{'label': 'A', 'text': '...'}, ...]
  correct_answer text not null, -- Matches one of the option labels or text
  category text not null -- e.g. 'Grammar', 'Vocabulary', 'Listening'
);

-- 5. ENROLLMENTS TABLE
create table enrollments (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  status text default 'active', -- 'active', 'expired', 'completed'
  expires_at timestamp with time zone
);

-- 6. USER SCORES TABLE
create table user_scores (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id uuid references quizzes(id) on delete cascade not null,
  score numeric not null,
  category_scores jsonb -- Breakdown e.g. {'Grammar': 80, 'Vocabulary': 50}
);

-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
alter table courses enable row level security;
alter table lessons enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table enrollments enable row level security;
alter table user_scores enable row level security;

-- POLICIES

-- Courses: Everyone can view
create policy "Courses are public" on courses for select using (true);

-- Lessons: Everyone can view
create policy "Lessons are public" on lessons for select using (true);

-- Quizzes: Everyone can view
create policy "Quizzes are public" on quizzes for select using (true);

-- Questions: Everyone can view
create policy "Questions are public" on questions for select using (true);

-- Enrollments: Users can view their own
create policy "Users can view own enrollments" on enrollments for select using (auth.uid() = user_id);

-- User Scores: Users can view their own.
create policy "Users can view own scores" on user_scores for select using (auth.uid() = user_id);
create policy "Users can insert own scores" on user_scores for insert with check (auth.uid() = user_id);
