-- Add DELETE policy for HR on payroll table
CREATE POLICY "HR can delete payroll records" 
ON public.payroll 
FOR DELETE 
USING (is_hr_user(auth.uid()));