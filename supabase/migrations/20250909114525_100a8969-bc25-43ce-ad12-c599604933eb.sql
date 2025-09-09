-- Add status column to profiles table for employee management
ALTER TABLE public.profiles 
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'banned'));

-- Create index for better performance on status queries
CREATE INDEX idx_profiles_status ON public.profiles(status);

-- Update RLS policies to prevent banned users from accessing data
CREATE POLICY "Banned users cannot access their profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id AND status != 'banned');

-- Drop the old policy that allowed all users to view their profile
DROP POLICY "Users can view their own profile" ON public.profiles;

-- Update other tables to prevent banned users from accessing data
CREATE POLICY "Banned users cannot view attendance" 
ON public.attendance 
FOR SELECT 
USING (auth.uid() = employee_id AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND status = 'active'
));

-- Drop old attendance policy and recreate with status check
DROP POLICY "Employees can view their own attendance" ON public.attendance;

-- Update leave applications policy
CREATE POLICY "Active employees can view their leave applications" 
ON public.leave_applications 
FOR SELECT 
USING (auth.uid() = employee_id AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND status = 'active'
));

-- Drop old leave applications policy
DROP POLICY "Employees can view their own leave applications" ON public.leave_applications;

-- Update tasks policy  
CREATE POLICY "Active employees can view their assigned tasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = assigned_to AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND status = 'active'
));

-- Drop old tasks policy
DROP POLICY "Employees can view their assigned tasks" ON public.tasks;