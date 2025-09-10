-- RLS Policies for employee_documents
CREATE POLICY "Employees can view their own documents" 
ON public.employee_documents 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "HR can view all documents" 
ON public.employee_documents 
FOR SELECT 
USING (is_hr_user(auth.uid()));

CREATE POLICY "HR can insert documents for employees" 
ON public.employee_documents 
FOR INSERT 
WITH CHECK (is_hr_user(auth.uid()));

CREATE POLICY "HR can update all documents" 
ON public.employee_documents 
FOR UPDATE 
USING (is_hr_user(auth.uid()));

CREATE POLICY "HR can delete documents" 
ON public.employee_documents 
FOR DELETE 
USING (is_hr_user(auth.uid()));

-- RLS Policies for holidays
CREATE POLICY "All users can view holidays" 
ON public.holidays 
FOR SELECT 
USING (true);

CREATE POLICY "HR can manage holidays" 
ON public.holidays 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for leave_balances
CREATE POLICY "Employees can view their own leave balances" 
ON public.leave_balances 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "HR can view all leave balances" 
ON public.leave_balances 
FOR SELECT 
USING (is_hr_user(auth.uid()));

CREATE POLICY "HR can manage all leave balances" 
ON public.leave_balances 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for salary_components
CREATE POLICY "Employees can view their own salary components" 
ON public.salary_components 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "HR can manage all salary components" 
ON public.salary_components 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for performance_reviews
CREATE POLICY "Employees can view their own performance reviews" 
ON public.performance_reviews 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "HR and reviewers can view reviews they're involved in" 
ON public.performance_reviews 
FOR SELECT 
USING (is_hr_user(auth.uid()) OR auth.uid() = reviewer_id);

CREATE POLICY "HR and reviewers can manage reviews" 
ON public.performance_reviews 
FOR ALL 
USING (is_hr_user(auth.uid()) OR auth.uid() = reviewer_id);

-- RLS Policies for self_assessments
CREATE POLICY "Employees can manage their own self assessments" 
ON public.self_assessments 
FOR ALL 
USING (auth.uid() = employee_id);

CREATE POLICY "HR can view all self assessments" 
ON public.self_assessments 
FOR SELECT 
USING (is_hr_user(auth.uid()));

-- RLS Policies for job_postings
CREATE POLICY "All users can view active job postings" 
ON public.job_postings 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "HR can manage job postings" 
ON public.job_postings 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for job_applications
CREATE POLICY "HR can view all job applications" 
ON public.job_applications 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for training_programs
CREATE POLICY "All users can view training programs" 
ON public.training_programs 
FOR SELECT 
USING (true);

CREATE POLICY "HR can manage training programs" 
ON public.training_programs 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for training_enrollments
CREATE POLICY "Employees can view their own enrollments" 
ON public.training_enrollments 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "Employees can enroll themselves" 
ON public.training_enrollments 
FOR INSERT 
WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "HR can manage all enrollments" 
ON public.training_enrollments 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for employee_certifications
CREATE POLICY "Employees can view their own certifications" 
ON public.employee_certifications 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "Employees can manage their own certifications" 
ON public.employee_certifications 
FOR ALL 
USING (auth.uid() = employee_id);

CREATE POLICY "HR can view all certifications" 
ON public.employee_certifications 
FOR SELECT 
USING (is_hr_user(auth.uid()));

-- RLS Policies for announcements
CREATE POLICY "Users can view relevant announcements" 
ON public.announcements 
FOR SELECT 
USING (
  target_audience = 'all' OR 
  (target_audience = 'hr' AND is_hr_user(auth.uid())) OR
  (target_audience = 'employees' AND NOT is_hr_user(auth.uid())) OR
  (target_audience = 'department' AND target_department = (SELECT department FROM profiles WHERE user_id = auth.uid()))
);

CREATE POLICY "HR can manage announcements" 
ON public.announcements 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for employee_recognitions
CREATE POLICY "Employees can view their own recognitions" 
ON public.employee_recognitions 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "Users can view public recognitions" 
ON public.employee_recognitions 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "HR can manage all recognitions" 
ON public.employee_recognitions 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for surveys
CREATE POLICY "Users can view relevant surveys" 
ON public.surveys 
FOR SELECT 
USING (
  status = 'active' AND
  (target_audience = 'all' OR 
   (target_audience = 'employees' AND NOT is_hr_user(auth.uid())) OR
   (target_audience = 'managers' AND is_hr_user(auth.uid())) OR
   (target_audience = 'department' AND target_department = (SELECT department FROM profiles WHERE user_id = auth.uid())))
);

CREATE POLICY "HR can manage surveys" 
ON public.surveys 
FOR ALL 
USING (is_hr_user(auth.uid()));

-- RLS Policies for survey_responses
CREATE POLICY "Users can view their own responses" 
ON public.survey_responses 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "Users can submit survey responses" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (auth.uid() = employee_id OR employee_id IS NULL);

CREATE POLICY "HR can view all survey responses" 
ON public.survey_responses 
FOR SELECT 
USING (is_hr_user(auth.uid()));

-- RLS Policies for audit_logs
CREATE POLICY "HR can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (is_hr_user(auth.uid()));

-- Storage policies for employee-documents bucket
CREATE POLICY "Employees can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'employee-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "HR can view all employee documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'employee-documents' AND is_hr_user(auth.uid()));

CREATE POLICY "HR can upload employee documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'employee-documents' AND is_hr_user(auth.uid()));

CREATE POLICY "HR can update employee documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'employee-documents' AND is_hr_user(auth.uid()));

CREATE POLICY "HR can delete employee documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'employee-documents' AND is_hr_user(auth.uid()));

-- Storage policies for training-materials bucket
CREATE POLICY "All users can view training materials" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'training-materials');

CREATE POLICY "HR can manage training materials" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'training-materials' AND is_hr_user(auth.uid()));

-- Storage policies for announcements bucket (already public)
CREATE POLICY "All users can view announcement attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'announcements');

CREATE POLICY "HR can manage announcement attachments" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'announcements' AND is_hr_user(auth.uid()));