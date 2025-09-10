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
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Plus, BookOpen, Calendar, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTrainingPrograms, useCreateTrainingProgram, useTrainingEnrollments, useEnrollInTraining } from '@/hooks/useTraining';

export const TrainingModule = () => {
  const { userProfile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainer_name: '',
    training_type: 'classroom',
    start_date: '',
    end_date: '',
    duration_hours: '',
    max_participants: '',
    location: ''
  });

  const { data: trainingPrograms = [] } = useTrainingPrograms();
  const { data: myEnrollments = [] } = useTrainingEnrollments(userProfile?.user_id);
  const createTrainingProgram = useCreateTrainingProgram();
  const enrollInTraining = useEnrollInTraining();

  const isHR = userProfile?.role === 'hr';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTrainingProgram.mutateAsync({
        ...formData,
        duration_hours: parseInt(formData.duration_hours) || null,
        max_participants: parseInt(formData.max_participants) || null
      });
      setFormData({
        title: '',
        description: '',
        trainer_name: '',
        training_type: 'classroom',
        start_date: '',
        end_date: '',
        duration_hours: '',
        max_participants: '',
        location: ''
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating training program:', error);
    }
  };

  const handleEnroll = async (trainingProgramId: string) => {
    await enrollInTraining.mutateAsync({ trainingProgramId });
  };

  const isEnrolled = (trainingId: string) => {
    return myEnrollments.some(enrollment => enrollment.training_program_id === trainingId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'outline';
      case 'ongoing': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled': return 'default';
      case 'completed': return 'secondary';
      case 'dropped': return 'destructive';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <CardTitle>Training & Development</CardTitle>
          </div>
          {isHR && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Program
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Training Program</DialogTitle>
                  <DialogDescription>
                    Set up a new training program for employees
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Program Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trainer_name">Trainer Name</Label>
                      <Input
                        id="trainer_name"
                        value={formData.trainer_name}
                        onChange={(e) => setFormData({...formData, trainer_name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="training_type">Training Type</Label>
                      <Select 
                        value={formData.training_type} 
                        onValueChange={(value) => setFormData({...formData, training_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classroom">Classroom</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration_hours">Duration (Hours)</Label>
                      <Input
                        id="duration_hours"
                        type="number"
                        value={formData.duration_hours}
                        onChange={(e) => setFormData({...formData, duration_hours: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max_participants">Max Participants</Label>
                      <Input
                        id="max_participants"
                        type="number"
                        value={formData.max_participants}
                        onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={createTrainingProgram.isPending}>
                      {createTrainingProgram.isPending ? 'Creating...' : 'Create Program'}
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
          Manage training programs and track employee development
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="programs" className="w-full">
          <TabsList>
            <TabsTrigger value="programs">Available Programs</TabsTrigger>
            <TabsTrigger value="my-training">My Training</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-4">
            <div className="grid gap-4">
              {trainingPrograms.map((program) => (
                <Card key={program.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{program.title}</h3>
                          <Badge variant={getStatusColor(program.status)}>
                            {program.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {program.training_type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          {program.trainer_name && <p>Trainer: {program.trainer_name}</p>}
                          {program.location && <p>Location: {program.location}</p>}
                          {program.duration_hours && <p>Duration: {program.duration_hours} hours</p>}
                          {program.start_date && (
                            <p>
                              Dates: {new Date(program.start_date).toLocaleDateString()} 
                              {program.end_date && ` - ${new Date(program.end_date).toLocaleDateString()}`}
                            </p>
                          )}
                        </div>
                        
                        {program.description && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {program.description}
                          </p>
                        )}
                      </div>
                      
                      {!isHR && program.status === 'planned' && (
                        <Button
                          size="sm"
                          onClick={() => handleEnroll(program.id)}
                          disabled={isEnrolled(program.id) || enrollInTraining.isPending}
                        >
                          {isEnrolled(program.id) ? 'Enrolled' : 'Enroll'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {trainingPrograms.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No training programs available</p>
                  {isHR && (
                    <p className="text-sm text-gray-400 mt-2">
                      Click "Create Program" to add your first training program
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-training" className="space-y-4">
            <div className="grid gap-4">
              {myEnrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {enrollment.training_program?.title}
                          </h3>
                          <Badge variant={getEnrollmentStatusColor(enrollment.enrollment_status)}>
                            {enrollment.enrollment_status}
                          </Badge>
                          {enrollment.certificate_issued && (
                            <Badge variant="secondary">
                              <Award className="h-3 w-3 mr-1" />
                              Certified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          {enrollment.training_program?.trainer_name && (
                            <p>Trainer: {enrollment.training_program.trainer_name}</p>
                          )}
                          {enrollment.training_program?.start_date && (
                            <p>
                              Start: {new Date(enrollment.training_program.start_date).toLocaleDateString()}
                            </p>
                          )}
                          <p>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                          {enrollment.completion_date && (
                            <p>Completed: {new Date(enrollment.completion_date).toLocaleDateString()}</p>
                          )}
                        </div>
                        
                        {enrollment.grade && (
                          <div className="mb-2">
                            <p className="text-sm font-medium">Grade: {enrollment.grade}</p>
                          </div>
                        )}
                        
                        {enrollment.feedback && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            Feedback: {enrollment.feedback}
                          </p>
                        )}
                      </div>
                      
                      {enrollment.enrollment_status === 'enrolled' && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-2">In Progress</p>
                          <Progress value={50} className="w-20" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {myEnrollments.length === 0 && (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">You're not enrolled in any training programs</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Check the "Available Programs" tab to enroll
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};