-- POLICY UPDATE FOR ADMIN ACCESS
-- For prototype purposes, we allow ANY authenticated user to manage content.
-- In a real production app, you would check for (auth.jwt() ->> 'email' IN ('admin@example.com')) OR use a dedicated 'admins' table.

-- 1. COURSES
create policy "Allow auth users to insert courses" on courses for insert with check (auth.role() = 'authenticated');
create policy "Allow auth users to update courses" on courses for update using (auth.role() = 'authenticated');
create policy "Allow auth users to delete courses" on courses for delete using (auth.role() = 'authenticated');

-- 2. LESSONS
create policy "Allow auth users to insert lessons" on lessons for insert with check (auth.role() = 'authenticated');
create policy "Allow auth users to update lessons" on lessons for update using (auth.role() = 'authenticated');
create policy "Allow auth users to delete lessons" on lessons for delete using (auth.role() = 'authenticated');

-- 3. QUIZZES
create policy "Allow auth users to insert quizzes" on quizzes for insert with check (auth.role() = 'authenticated');
create policy "Allow auth users to update quizzes" on quizzes for update using (auth.role() = 'authenticated');
create policy "Allow auth users to delete quizzes" on quizzes for delete using (auth.role() = 'authenticated');

-- 4. QUESTIONS
create policy "Allow auth users to insert questions" on questions for insert with check (auth.role() = 'authenticated');
create policy "Allow auth users to update questions" on questions for update using (auth.role() = 'authenticated');
create policy "Allow auth users to delete questions" on questions for delete using (auth.role() = 'authenticated');

-- 5. ENROLLMENTS (Admin management)
create policy "Allow auth users to insert enrollments" on enrollments for insert with check (auth.role() = 'authenticated');
create policy "Allow auth users to update enrollments" on enrollments for update using (auth.role() = 'authenticated');
-- (Select policy 'Users can view own enrollments' already exists, we might need an admin view policy if admins aren't the user)
create policy "Allow auth users to view all enrollments" on enrollments for select using (auth.role() = 'authenticated'); 
-- Note: This overrides the previous specific user policy by being broader. PostgreSQL policies are permissive (OR logic).
