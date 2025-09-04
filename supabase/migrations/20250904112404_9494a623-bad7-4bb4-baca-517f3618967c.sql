-- Create payroll table
CREATE TABLE public.payroll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  base_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
  deductions DECIMAL(10,2) NOT NULL DEFAULT 0,
  bonuses DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_pay DECIMAL(10,2) NOT NULL DEFAULT 0,
  working_days INTEGER NOT NULL DEFAULT 22,
  present_days INTEGER NOT NULL DEFAULT 0,
  late_days INTEGER NOT NULL DEFAULT 0,
  generated_by UUID NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

-- Enable RLS on payroll table
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- RLS policies for payroll
CREATE POLICY "Employees can view their own payroll" 
ON public.payroll 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "HR can view all payroll" 
ON public.payroll 
FOR SELECT 
USING (is_hr_user(auth.uid()));

CREATE POLICY "HR can create payroll" 
ON public.payroll 
FOR INSERT 
WITH CHECK (is_hr_user(auth.uid()));

CREATE POLICY "HR can update payroll" 
ON public.payroll 
FOR UPDATE 
USING (is_hr_user(auth.uid()));

-- Add updated_at trigger for payroll
CREATE TRIGGER update_payroll_updated_at
  BEFORE UPDATE ON public.payroll
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add base salary field to profiles for easier payroll generation
ALTER TABLE public.profiles 
ADD COLUMN base_salary DECIMAL(10,2) DEFAULT 0;