-- Add additional fields to profiles table for extended profile management
ALTER TABLE public.profiles 
ADD COLUMN address TEXT,
ADD COLUMN job_title TEXT,
ADD COLUMN bio TEXT;

-- Create attendance table for clock in/out functionality
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  clock_out TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_hours DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on attendance table
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create attendance policies
CREATE POLICY "Employees can view their own attendance" 
ON public.attendance 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "Employees can create their own attendance" 
ON public.attendance 
FOR INSERT 
WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Employees can update their own attendance" 
ON public.attendance 
FOR UPDATE 
USING (auth.uid() = employee_id);

CREATE POLICY "HR can view all attendance" 
ON public.attendance 
FOR SELECT 
USING (is_hr_user(auth.uid()));

CREATE POLICY "HR can update all attendance" 
ON public.attendance 
FOR UPDATE 
USING (is_hr_user(auth.uid()));

-- Create task submissions table for file uploads and comments
CREATE TABLE public.task_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  comment TEXT,
  file_url TEXT,
  file_name TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  hr_feedback TEXT,
  approved_by UUID,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on task submissions
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;

-- Create task submissions policies
CREATE POLICY "Employees can view their own task submissions" 
ON public.task_submissions 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "Employees can create their own task submissions" 
ON public.task_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Employees can update their own pending submissions" 
ON public.task_submissions 
FOR UPDATE 
USING (auth.uid() = employee_id AND approval_status = 'pending');

CREATE POLICY "HR can view all task submissions" 
ON public.task_submissions 
FOR SELECT 
USING (is_hr_user(auth.uid()));

CREATE POLICY "HR can update all task submissions" 
ON public.task_submissions 
FOR UPDATE 
USING (is_hr_user(auth.uid()));

-- Add trigger for updating timestamps
CREATE TRIGGER update_attendance_updated_at
BEFORE UPDATE ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_submissions_updated_at
BEFORE UPDATE ON public.task_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate total hours
CREATE OR REPLACE FUNCTION public.calculate_attendance_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clock_out IS NOT NULL THEN
    NEW.total_hours = EXTRACT(EPOCH FROM (NEW.clock_out - NEW.clock_in)) / 3600;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to calculate hours on update
CREATE TRIGGER calculate_hours_on_update
BEFORE UPDATE ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION public.calculate_attendance_hours();