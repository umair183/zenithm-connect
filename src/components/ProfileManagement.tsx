import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/useProfiles';
import { User, Edit, Save, X } from 'lucide-react';

interface ProfileManagementProps {
  isReadOnly?: boolean;
  profile?: any;
}

export const ProfileManagement = ({ isReadOnly = false, profile }: ProfileManagementProps) => {
  const { userProfile } = useAuth();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || userProfile?.full_name || '',
    email: profile?.email || userProfile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    department: profile?.department || '',
    job_title: profile?.job_title || '',
    bio: profile?.bio || '',
    employee_id: profile?.employee_id || userProfile?.employee_id || '',
  });

  const targetProfile = profile || userProfile;

  const handleSave = async () => {
    if (!targetProfile?.id) return;
    
    try {
      await updateProfile.mutateAsync({
        id: targetProfile.id,
        updates: formData
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: targetProfile?.full_name || '',
      email: targetProfile?.email || '',
      phone: targetProfile?.phone || '',
      address: targetProfile?.address || '',
      department: targetProfile?.department || '',
      job_title: targetProfile?.job_title || '',
      bio: targetProfile?.bio || '',
      employee_id: targetProfile?.employee_id || '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={targetProfile?.avatar_url} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{targetProfile?.full_name}</CardTitle>
              <CardDescription>{targetProfile?.job_title || 'Employee'}</CardDescription>
            </div>
          </div>
          {!isReadOnly && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm" disabled={updateProfile.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="employee_id">Employee ID</Label>
            <Input
              id="employee_id"
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="job_title">Job Title</Label>
            <Input
              id="job_title"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};