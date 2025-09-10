import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Megaphone, Plus, Pin, Calendar, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncements';

export const AnnouncementBoard = () => {
  const { userProfile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    announcement_type: 'general',
    target_audience: 'all',
    target_department: '',
    is_pinned: false,
    expires_at: ''
  });

  const { data: announcements = [] } = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const isHR = userProfile?.role === 'hr';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const announcementData = {
        ...formData,
        expires_at: formData.expires_at || null,
        target_department: formData.target_audience === 'department' ? formData.target_department : null
      };

      if (editingAnnouncement) {
        await updateAnnouncement.mutateAsync({
          id: editingAnnouncement.id,
          updates: announcementData
        });
      } else {
        await createAnnouncement.mutateAsync(announcementData);
      }
      
      setFormData({
        title: '',
        content: '',
        announcement_type: 'general',
        target_audience: 'all',
        target_department: '',
        is_pinned: false,
        expires_at: ''
      });
      setEditingAnnouncement(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      announcement_type: announcement.announcement_type,
      target_audience: announcement.target_audience,
      target_department: announcement.target_department || '',
      is_pinned: announcement.is_pinned,
      expires_at: announcement.expires_at ? announcement.expires_at.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement.mutateAsync(id);
    }
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'destructive';
      case 'event': return 'default';
      case 'policy': return 'secondary';
      case 'celebration': return 'default';
      default: return 'outline';
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    // Pinned announcements first
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    
    // Then by publish date (newest first)
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5" />
            <CardTitle>Announcements</CardTitle>
          </div>
          {isHR && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingAnnouncement(null);
                  setFormData({
                    title: '',
                    content: '',
                    announcement_type: 'general',
                    target_audience: 'all',
                    target_department: '',
                    is_pinned: false,
                    expires_at: ''
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAnnouncement ? 'Update announcement details' : 'Share important information with your team'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      required
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="announcement_type">Type</Label>
                      <Select 
                        value={formData.announcement_type} 
                        onValueChange={(value) => setFormData({...formData, announcement_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="policy">Policy</SelectItem>
                          <SelectItem value="celebration">Celebration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="target_audience">Target Audience</Label>
                      <Select 
                        value={formData.target_audience} 
                        onValueChange={(value) => setFormData({...formData, target_audience: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Employees</SelectItem>
                          <SelectItem value="hr">HR Only</SelectItem>
                          <SelectItem value="employees">Employees Only</SelectItem>
                          <SelectItem value="department">Specific Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {formData.target_audience === 'department' && (
                    <div className="space-y-2">
                      <Label htmlFor="target_department">Department</Label>
                      <Input
                        id="target_department"
                        value={formData.target_department}
                        onChange={(e) => setFormData({...formData, target_department: e.target.value})}
                        placeholder="Enter department name"
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                    <Input
                      id="expires_at"
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_pinned"
                      checked={formData.is_pinned}
                      onCheckedChange={(checked) => setFormData({...formData, is_pinned: checked})}
                    />
                    <Label htmlFor="is_pinned">Pin this announcement</Label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={createAnnouncement.isPending || updateAnnouncement.isPending}>
                      {editingAnnouncement ? 'Update' : 'Publish'}
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
          Company announcements and important updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className={`${
                announcement.is_pinned ? 'ring-2 ring-blue-200 bg-blue-50' : ''
              } ${
                isExpired(announcement.expires_at) ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {announcement.is_pinned && (
                        <Pin className="h-4 w-4 text-blue-600" />
                      )}
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      <Badge variant={getAnnouncementTypeColor(announcement.announcement_type)}>
                        {announcement.announcement_type}
                      </Badge>
                      {isExpired(announcement.expires_at) && (
                        <Badge variant="outline">Expired</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By: {announcement.publisher?.full_name}</span>
                      <span>
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(announcement.published_at).toLocaleDateString()}
                      </span>
                      <span className="capitalize">
                        Target: {announcement.target_audience}
                        {announcement.target_department && ` (${announcement.target_department})`}
                      </span>
                      {announcement.expires_at && (
                        <span>
                          Expires: {new Date(announcement.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isHR && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {announcements.length === 0 && (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No announcements yet</p>
              {isHR && (
                <p className="text-sm text-gray-400 mt-2">
                  Click "New Announcement" to share important updates
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};