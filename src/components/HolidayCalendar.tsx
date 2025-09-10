import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHolidays, useCreateHoliday, useUpdateHoliday, useDeleteHoliday } from '@/hooks/useHolidays';

export const HolidayCalendar = () => {
  const { userProfile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingHoliday, setEditingHoliday] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'public',
    description: ''
  });

  const { data: holidays = [] } = useHolidays(selectedYear);
  const createHoliday = useCreateHoliday();
  const updateHoliday = useUpdateHoliday();
  const deleteHoliday = useDeleteHoliday();

  const isHR = userProfile?.role === 'hr';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingHoliday) {
        await updateHoliday.mutateAsync({
          id: editingHoliday.id,
          updates: formData
        });
      } else {
        await createHoliday.mutateAsync(formData);
      }
      
      setFormData({ name: '', date: '', type: 'public', description: '' });
      setEditingHoliday(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving holiday:', error);
    }
  };

  const handleEdit = (holiday: any) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      description: holiday.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      await deleteHoliday.mutateAsync(id);
    }
  };

  const getHolidaysByMonth = () => {
    const monthlyHolidays: { [key: string]: any[] } = {};
    
    holidays.forEach(holiday => {
      const month = new Date(holiday.date).toLocaleString('default', { month: 'long' });
      if (!monthlyHolidays[month]) {
        monthlyHolidays[month] = [];
      }
      monthlyHolidays[month].push(holiday);
    });
    
    return monthlyHolidays;
  };

  const monthlyHolidays = getHolidaysByMonth();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Holiday Calendar</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Select 
              value={selectedYear.toString()} 
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() + i - 2;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {isHR && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingHoliday(null);
                    setFormData({ name: '', date: '', type: 'public', description: '' });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holiday
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingHoliday ? 'Update holiday information' : 'Create a new holiday for the calendar'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Holiday Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => setFormData({...formData, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public Holiday</SelectItem>
                          <SelectItem value="company">Company Holiday</SelectItem>
                          <SelectItem value="optional">Optional Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Additional details about the holiday"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={createHoliday.isPending || updateHoliday.isPending}>
                        {editingHoliday ? 'Update' : 'Create'}
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
        </div>
        <CardDescription>
          View and manage company holidays for {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(monthlyHolidays).map(([month, monthHolidays]) => (
            <div key={month}>
              <h3 className="text-lg font-semibold mb-3">{month}</h3>
              <div className="grid gap-3">
                {monthHolidays.map((holiday) => (
                  <div 
                    key={holiday.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <p className="font-medium">{holiday.name}</p>
                        <Badge 
                          variant={
                            holiday.type === 'public' ? 'default' :
                            holiday.type === 'company' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {holiday.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(holiday.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      {holiday.description && (
                        <p className="text-sm text-gray-500 mt-1">{holiday.description}</p>
                      )}
                    </div>
                    
                    {isHR && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(holiday)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(holiday.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {holidays.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No holidays defined for {selectedYear}</p>
              {isHR && (
                <p className="text-sm text-gray-400 mt-2">
                  Click "Add Holiday" to create your first holiday
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};