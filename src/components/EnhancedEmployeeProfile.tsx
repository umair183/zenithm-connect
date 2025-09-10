import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Trash2, FileText, Award, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/useProfiles';
import { useEmployeeDocuments, useUploadDocument, useDeleteDocument } from '@/hooks/useEmployeeDocuments';
import { useEmployeeRecognitions } from '@/hooks/useEmployeeRecognition';
import { useSalaryComponents } from '@/hooks/useSalaryComponents';
import { ProfileManagement } from './ProfileManagement';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedEmployeeProfileProps {
  employee: any;
  isReadOnly?: boolean;
}

export const EnhancedEmployeeProfile = ({ employee, isReadOnly = false }: EnhancedEmployeeProfileProps) => {
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employee || {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');

  const updateProfile = useUpdateProfile();
  const { data: documents = [] } = useEmployeeDocuments(employee?.user_id);
  const { data: recognitions = [] } = useEmployeeRecognitions(employee?.user_id);
  const { data: salaryComponents = [] } = useSalaryComponents(employee?.user_id);
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();

  const isHR = userProfile?.role === 'hr';
  const canEdit = !isReadOnly && (isHR || userProfile?.user_id === employee?.user_id);

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      id: employee.id,
      updates: formData
    });
    setIsEditing(false);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !documentType) return;
    
    await uploadDocument.mutateAsync({
      file: selectedFile,
      employeeId: employee.user_id,
      documentType,
      documentName: selectedFile.name
    });
    
    setSelectedFile(null);
    setDocumentType('');
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data } = await supabase.storage
      .from('employee-documents')
      .download(filePath);
    
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Employee Profile: {employee?.full_name}
            {canEdit && (
              <Button 
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="salary">Salary</TabsTrigger>
              <TabsTrigger value="recognition">Recognition</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input
                    id="contact_number"
                    value={formData.contact_number || ''}
                    onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    value={formData.job_title || ''}
                    onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contract_type">Contract Type</Label>
                  <Select 
                    value={formData.contract_type || ''} 
                    onValueChange={(value) => setFormData({...formData, contract_type: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hire_date">Hire Date</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date || ''}
                    onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name || ''}
                    onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    value={formData.emergency_contact_phone || ''}
                    onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              {isHR && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Document</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="file">Select File</Label>
                        <Input
                          id="file"
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Document Type</Label>
                        <Select value={documentType} onValueChange={setDocumentType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cv">CV/Resume</SelectItem>
                            <SelectItem value="certificate">Certificate</SelectItem>
                            <SelectItem value="id_proof">ID Proof</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={handleFileUpload}
                          disabled={!selectedFile || !documentType || uploadDocument.isPending}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadDocument.isPending ? 'Uploading...' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.document_name}</p>
                            <p className="text-sm text-gray-600 capitalize">{doc.document_type.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(doc.file_path, doc.document_name)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {isHR && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteDocument.mutate(doc.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {documents.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No documents uploaded</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="salary" className="space-y-4">
              {isHR && (
                <>
                  <div className="grid gap-4">
                    {salaryComponents.map((component) => (
                      <Card key={component.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{component.component_name}</p>
                              <p className="text-sm text-gray-600 capitalize">{component.component_type}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {component.is_percentage ? `${component.amount}%` : `$${component.amount}`}
                              </p>
                              {component.percentage_of && (
                                <p className="text-xs text-gray-500">of {component.percentage_of}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {salaryComponents.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No salary components defined</p>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="recognition" className="space-y-4">
              <div className="grid gap-4">
                {recognitions.map((recognition) => (
                  <Card key={recognition.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Award className="w-5 h-5 text-yellow-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium">{recognition.title}</p>
                          <p className="text-sm text-gray-600 capitalize">{recognition.recognition_type}</p>
                          <p className="text-sm text-gray-700 mt-1">{recognition.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              Awarded: {new Date(recognition.award_date).toLocaleDateString()}
                            </p>
                            {recognition.monetary_value > 0 && (
                              <Badge variant="secondary">${recognition.monetary_value}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {recognitions.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recognitions yet</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <p className="text-center text-gray-500 py-4">Performance data will be available here</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};