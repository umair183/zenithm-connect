import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Users, Calendar, Eye, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobPostings, useCreateJobPosting, useJobApplications, useUpdateJobApplication } from '@/hooks/useRecruitment';

export const RecruitmentModule = () => {
  const { userProfile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJobPosting, setSelectedJobPosting] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    job_description: '',
    requirements: '',
    salary_range: '',
    employment_type: 'full_time',
    location: '',
    application_deadline: ''
  });

  const { data: jobPostings = [] } = useJobPostings();
  const { data: applications = [] } = useJobApplications(selectedJobPosting?.id);
  const createJobPosting = useCreateJobPosting();
  const updateJobApplication = useUpdateJobApplication();

  const isHR = userProfile?.role === 'hr';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createJobPosting.mutateAsync(formData);
      setFormData({
        title: '',
        department: '',
        job_description: '',
        requirements: '',
        salary_range: '',
        employment_type: 'full_time',
        location: '',
        application_deadline: ''
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating job posting:', error);
    }
  };

  const handleApplicationUpdate = async (applicationId: string, status: string) => {
    await updateJobApplication.mutateAsync({
      id: applicationId,
      updates: { application_status: status }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'default';
      case 'shortlisted': return 'secondary';
      case 'interview_scheduled': return 'default';
      case 'interviewed': return 'secondary';
      case 'selected': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <CardTitle>Recruitment Management</CardTitle>
          </div>
          {isHR && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Job Posting</DialogTitle>
                  <DialogDescription>
                    Create a new job posting for recruitment
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="job_description">Job Description</Label>
                    <Textarea
                      id="job_description"
                      value={formData.job_description}
                      onChange={(e) => setFormData({...formData, job_description: e.target.value})}
                      required
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary_range">Salary Range</Label>
                      <Input
                        id="salary_range"
                        value={formData.salary_range}
                        onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                        placeholder="e.g., $50,000 - $70,000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employment_type">Employment Type</Label>
                      <Select 
                        value={formData.employment_type} 
                        onValueChange={(value) => setFormData({...formData, employment_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="application_deadline">Application Deadline</Label>
                      <Input
                        id="application_deadline"
                        type="date"
                        value={formData.application_deadline}
                        onChange={(e) => setFormData({...formData, application_deadline: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={createJobPosting.isPending}>
                      {createJobPosting.isPending ? 'Creating...' : 'Create Job Posting'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription>
          Manage job postings and track applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="postings" className="w-full">
          <TabsList>
            <TabsTrigger value="postings">Job Postings</TabsTrigger>
            {isHR && <TabsTrigger value="applications">Applications</TabsTrigger>}
          </TabsList>

          <TabsContent value="postings" className="space-y-4">
            <div className="grid gap-4">
              {jobPostings.map((job) => (
                <Card key={job.id} className={selectedJobPosting?.id === job.id ? 'ring-2 ring-blue-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          {job.department && <p>Department: {job.department}</p>}
                          {job.location && <p>Location: {job.location}</p>}
                          {job.salary_range && <p>Salary: {job.salary_range}</p>}
                          <p>Type: {job.employment_type.replace('_', ' ')}</p>
                          {job.application_deadline && (
                            <p>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</p>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {job.job_description}
                        </p>
                      </div>
                      
                      {isHR && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedJobPosting(job)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Applications
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {jobPostings.length === 0 && (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No job postings available</p>
                  {isHR && (
                    <p className="text-sm text-gray-400 mt-2">
                      Click "Post New Job" to create your first job posting
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {isHR && (
            <TabsContent value="applications" className="space-y-4">
              {selectedJobPosting ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-semibold">Applications for: {selectedJobPosting.title}</h3>
                    <Badge>{applications.length} applications</Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {applications.map((application) => (
                      <Card key={application.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold">{application.applicant_name}</h4>
                                <Badge variant={getStatusColor(application.application_status)}>
                                  {application.application_status.replace('_', ' ')}
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Email: {application.applicant_email}</p>
                                {application.applicant_phone && <p>Phone: {application.applicant_phone}</p>}
                                <p>Applied: {new Date(application.created_at).toLocaleDateString()}</p>
                              </div>
                              
                              {application.cover_letter && (
                                <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                                  {application.cover_letter}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                              <Button
                                size="sm"
                                onClick={() => handleApplicationUpdate(application.id, 'shortlisted')}
                                disabled={application.application_status === 'shortlisted'}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Shortlist
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                                disabled={application.application_status === 'rejected'}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {applications.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No applications yet for this position</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Select a job posting to view applications</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};