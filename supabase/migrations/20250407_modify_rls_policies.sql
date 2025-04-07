
-- Update RLS policies to allow teachers and committee members to view all profiles
CREATE POLICY "Teachers can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'teacher'
    )
  );

CREATE POLICY "Committee members can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'committee'
    )
  );

-- Similarly for student_profiles table
CREATE POLICY "Teachers can view all student profiles" 
  ON public.student_profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'teacher'
    )
  );

CREATE POLICY "Committee members can view all student profiles" 
  ON public.student_profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'committee'
    )
  );

-- Similarly for teacher_profiles table
CREATE POLICY "Teachers can view all teacher profiles" 
  ON public.teacher_profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'teacher'
    )
  );

CREATE POLICY "Committee members can view all teacher profiles" 
  ON public.teacher_profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'committee'
    )
  );

-- Similarly for committee_profiles table
CREATE POLICY "Teachers can view all committee profiles" 
  ON public.committee_profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'teacher'
    )
  );

CREATE POLICY "Committee members can view all committee profiles" 
  ON public.committee_profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'committee'
    )
  );
