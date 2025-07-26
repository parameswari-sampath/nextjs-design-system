import React, { useState, useEffect } from 'react';
import { WizardProvider, useWizard } from './wizard-context';
import WizardConnected from './wizard-connected';
import Input from './input';
import Textarea from './textarea';
import Select from './select';
import Checkbox from './checkbox';
import Button from './button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from './table';
import Badge from './badge';
import Card, { CardHeader, CardTitle, CardContent } from './card';

// Types for test creation
interface TestMetadata {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  category: string;
  instructions: string;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  isMandatory?: boolean;
}

interface TestSettings {
  randomizeQuestions: boolean;
  showResults: boolean;
  allowRetake: boolean;
  timeLimit: boolean;
  passingScore: number;
}

// Mock questions data
const mockQuestions: Question[] = Array.from({ length: 50 }, (_, i) => ({
  id: `q_${i + 1}`,
  text: `Sample question ${i + 1}: This is a test question about various topics?`,
  type: ['multiple_choice', 'true_false', 'short_answer'][Math.floor(Math.random() * 3)] as Question['type'],
  difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as Question['difficulty'],
  category: ['Math', 'Science', 'History', 'Literature'][Math.floor(Math.random() * 4)],
  points: Math.floor(Math.random() * 5) + 1,
  isMandatory: Math.random() > 0.7,
}));

// Step 1: Test Metadata Form
const TestMetadataForm: React.FC = () => {
  const wizard = useWizard();
  const [metadata, setMetadata] = useState<TestMetadata>({
    title: '',
    description: '',
    duration: '',
    difficulty: '',
    category: '',
    instructions: '',
  });

  // Validation logic
  useEffect(() => {
    const isValid = !!(
      metadata.title.trim() &&
      metadata.description.trim() &&
      metadata.duration &&
      metadata.difficulty &&
      metadata.category
    );

    wizard.setStepValid(0, isValid);
    
    if (!isValid) {
      wizard.setValidationMessage('Please fill in all required fields to continue');
    } else {
      wizard.setValidationMessage(undefined);
    }
  }, [metadata, wizard]);

  const updateField = (field: keyof TestMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Test Title *
        </label>
        <Input
          value={metadata.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter test title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Description *
        </label>
        <Textarea
          value={metadata.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Enter test description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Duration *
          </label>
          <Select
            value={metadata.duration}
            onChange={(e) => updateField('duration', e.target.value)}
          >
            <option value="">Select duration</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Difficulty *
          </label>
          <Select
            value={metadata.difficulty}
            onChange={(e) => updateField('difficulty', e.target.value)}
          >
            <option value="">Select difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Category *
        </label>
        <Select
          value={metadata.category}
          onChange={(e) => updateField('category', e.target.value)}
        >
          <option value="">Select category</option>
          <option value="math">Mathematics</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          <option value="literature">Literature</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Instructions
        </label>
        <Textarea
          value={metadata.instructions}
          onChange={(e) => updateField('instructions', e.target.value)}
          placeholder="Enter special instructions for test takers"
          rows={3}
        />
      </div>
    </div>
  );
};

// Step 2: Questions Selection Table
const QuestionsSelectionTable: React.FC = () => {
  const wizard = useWizard();
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  // Filter questions based on search and filters
  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || question.category === filterCategory;
    const matchesDifficulty = !filterDifficulty || question.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Validation logic
  useEffect(() => {
    const mandatoryQuestions = mockQuestions.filter(q => q.isMandatory);
    const selectedMandatoryQuestions = mandatoryQuestions.filter(q => selectedQuestions.has(q.id));
    
    const hasMinimumQuestions = selectedQuestions.size >= 5;
    const hasAllMandatoryQuestions = selectedMandatoryQuestions.length === mandatoryQuestions.length;
    
    const isValid = hasMinimumQuestions && hasAllMandatoryQuestions;
    
    wizard.setStepValid(1, isValid);
    
    if (!hasMinimumQuestions) {
      wizard.setValidationMessage('Please select at least 5 questions to continue');
    } else if (!hasAllMandatoryQuestions) {
      wizard.setValidationMessage(`Please select all mandatory questions (${mandatoryQuestions.length - selectedMandatoryQuestions.length} remaining)`);
    } else {
      wizard.setValidationMessage(undefined);
    }
  }, [selectedQuestions, wizard]);

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search questions..."
        />
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Literature">Literature</option>
        </Select>
        <Select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>
      </div>

      {/* Selection Summary */}
      <div className="flex items-center justify-between p-3 bg-[var(--color-secondary)] rounded">
        <span className="text-sm">
          Selected: <strong>{selectedQuestions.size}</strong> questions
        </span>
        <span className="text-sm text-[var(--color-muted-foreground)]">
          Mandatory: {mockQuestions.filter(q => q.isMandatory && selectedQuestions.has(q.id)).length} / {mockQuestions.filter(q => q.isMandatory).length}
        </span>
      </div>

      {/* Questions Table */}
      <div className="border rounded-[var(--radius)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedQuestions.has(question.id)}
                    onChange={() => toggleQuestion(question.id)}
                  />
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate" title={question.text}>
                    {question.text}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {question.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{question.category}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      question.difficulty === 'easy' ? 'success' : 
                      question.difficulty === 'medium' ? 'warning' : 
                      'destructive'
                    }
                  >
                    {question.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>{question.points}</TableCell>
                <TableCell>
                  {question.isMandatory && (
                    <Badge variant="info">Mandatory</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-8 text-[var(--color-muted-foreground)]">
          No questions found matching your criteria
        </div>
      )}
    </div>
  );
};

// Step 3: Test Settings
const TestSettingsForm: React.FC = () => {
  const wizard = useWizard();
  const [settings, setSettings] = useState<TestSettings>({
    randomizeQuestions: false,
    showResults: true,
    allowRetake: false,
    timeLimit: true,
    passingScore: 70,
  });

  // Always valid step (optional configurations)
  useEffect(() => {
    wizard.setStepValid(2, true);
  }, [wizard]);

  const updateSetting = (field: keyof TestSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Checkbox
          checked={settings.randomizeQuestions}
          onChange={(e) => updateSetting('randomizeQuestions', e.target.checked)}
          label="Randomize question order for each test taker"
        />
        
        <Checkbox
          checked={settings.showResults}
          onChange={(e) => updateSetting('showResults', e.target.checked)}
          label="Show results immediately after test completion"
        />
        
        <Checkbox
          checked={settings.allowRetake}
          onChange={(e) => updateSetting('allowRetake', e.target.checked)}
          label="Allow test retakes"
        />
        
        <Checkbox
          checked={settings.timeLimit}
          onChange={(e) => updateSetting('timeLimit', e.target.checked)}
          label="Enable time limit"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Passing Score (%)
        </label>
        <Input
          type="number"
          min="0"
          max="100"
          value={settings.passingScore}
          onChange={(e) => updateSetting('passingScore', parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  );
};

// Step 4: Review and Publish
const TestReviewSummary: React.FC = () => {
  const wizard = useWizard();

  useEffect(() => {
    wizard.setStepValid(3, true);
  }, [wizard]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Title:</strong> Sample Test Title
            </div>
            <div>
              <strong>Duration:</strong> 1 hour
            </div>
            <div>
              <strong>Questions:</strong> 15 selected
            </div>
            <div>
              <strong>Difficulty:</strong> Intermediate
            </div>
            <div>
              <strong>Category:</strong> Mathematics
            </div>
            <div>
              <strong>Passing Score:</strong> 70%
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-[var(--color-secondary)] rounded border-l-4 border-l-[var(--color-success)]">
        <p className="text-sm font-medium text-[var(--color-success)]">✓ Ready to Publish</p>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Your test is configured and ready to be published. Click "Complete" to finalize.
        </p>
      </div>
    </div>
  );
};

// Main Test Creation Component
const TestCreationContent: React.FC = () => {
  const wizard = useWizard();

  const steps = [
    { id: 'metadata', title: 'Test Information', description: 'Basic test details and metadata' },
    { id: 'questions', title: 'Select Questions', description: 'Choose questions from the question bank' },
    { id: 'settings', title: 'Test Settings', description: 'Configure test parameters' },
    { id: 'review', title: 'Review & Publish', description: 'Final review before publishing' }
  ];

  const renderStepContent = () => {
    switch (wizard.currentStep) {
      case 0:
        return <TestMetadataForm />;
      case 1:
        return <QuestionsSelectionTable />;
      case 2:
        return <TestSettingsForm />;
      case 3:
        return <TestReviewSummary />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <WizardConnected steps={steps}>
      {renderStepContent()}
    </WizardConnected>
  );
};

// Export the complete example
const TestCreationExample: React.FC = () => {
  return (
    <WizardProvider
      totalSteps={4}
      navigationRules={{
        canSkipSteps: false,
        canGoBackward: true,
        canClickPreviousSteps: true,
        requireSequentialCompletion: true,
        allowIncompleteNavigation: false,
      }}
      onComplete={() => {
        alert('Test created successfully!');
      }}
      onStepChange={(step, direction) => {
        console.log(`Navigated to step ${step + 1} via ${direction}`);
      }}
    >
      <TestCreationContent />
    </WizardProvider>
  );
};

export default TestCreationExample;