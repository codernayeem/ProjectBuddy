import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useCreateTeam } from '@/hooks/useTeams';
import { Badge } from '@/components/ui/Badge';

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const createTeamMutation = useCreateTeam();

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    visibility: 'PUBLIC',
    type: 'OTHER',
    website: '',
    country: '',
    city: '',
    avatar: null as File | null,
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVisibilityChange = (value: string) => {
    setFormData({
      ...formData,
      visibility: value,
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: any = {
      name: formData.name,
      description: formData.description,
      visibility: formData.visibility,
      type: formData.type,
    };

    if (formData.shortDescription) submitData.shortDescription = formData.shortDescription;
    if (formData.website) submitData.website = formData.website;
    if (formData.country) submitData.country = formData.country;
    if (formData.city) submitData.city = formData.city;
    if (skills.length > 0) submitData.skills = skills;
    if (tags.length > 0) submitData.tags = tags;
    // Note: avatar and banner upload would need separate endpoint or multipart form support
    // For now, we'll skip image upload in this version

    try {
      const result = await createTeamMutation.mutateAsync(submitData);
      if (result.data) {
        navigate(`/dashboard/teams/${result.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/dashboard/teams">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Link>
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create a New Team</h1>
        <p className="text-gray-600 mt-2">
          Start a team to collaborate with others on exciting projects.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter team name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="A brief one-liner about your team"
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your team, its goals, and what you're working on"
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="visibility">Visibility *</Label>
                <Select value={formData.visibility} onValueChange={handleVisibilityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public - Anyone can see and join</SelectItem>
                    <SelectItem value="PRIVATE">Private - Only members can see</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Team Type *</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SKILL_BASED">Skill-Based - Focused on developing specific skills</SelectItem>
                    <SelectItem value="STARTUP">Startup - Building a new venture</SelectItem>
                    <SelectItem value="FREELANCE">Freelance - Collaboration on freelance projects</SelectItem>
                    <SelectItem value="OPEN_SOURCE">Open Source - Contributing to open source</SelectItem>
                    <SelectItem value="HACKATHON">Hackathon - Competing in hackathons</SelectItem>
                    <SelectItem value="STUDY_GROUP">Study Group - Learning together</SelectItem>
                    <SelectItem value="NETWORKING">Networking - Building connections</SelectItem>
                    <SelectItem value="MENTORSHIP">Mentorship - Mentoring and learning</SelectItem>
                    <SelectItem value="BUSINESS">Business - Business collaboration</SelectItem>
                    <SelectItem value="OTHER">Other - General purpose team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skills">Required Skills</Label>
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type a skill and press Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="default" className="flex items-center space-x-1">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Links */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g., United States"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourteam.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Team Avatar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="avatar">Team Avatar (Optional)</Label>
                <div className="flex items-center space-x-4 mt-2">
                  {avatarPreview && (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <label htmlFor="avatar" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                          <Upload className="w-5 h-5" />
                          <span>Click to upload avatar</span>
                        </div>
                      </div>
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Note: Avatar upload will be available after team creation</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" asChild>
              <Link to="/dashboard/teams">Cancel</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={createTeamMutation.isPending || !formData.name || !formData.description}
            >
              {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
