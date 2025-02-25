'use client';

import { useState } from 'react';
import { Card, Typography, Button, Stepper, Step, StepLabel, Box } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: {
    title: string;
    content: string;
  }[];
}

const tutorials: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with STOREFRONT',
    description: 'Learn the basics of navigating and using the STOREFRONT ERP system.',
    steps: [
      {
        title: 'Dashboard Overview',
        content: 'Explore the main dashboard and understand key metrics and navigation.'
      },
      {
        title: 'Basic Operations',
        content: 'Learn how to perform common tasks like creating orders and managing inventory.'
      },
      {
        title: 'Advanced Features',
        content: 'Discover advanced features and customization options available to you.'
      }
    ]
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management',
    description: 'Master the inventory management system.',
    steps: [
      {
        title: 'Stock Overview',
        content: 'Learn how to view and understand your current stock levels.'
      },
      {
        title: 'Managing Products',
        content: 'Add, edit, and organize your product catalog effectively.'
      },
      {
        title: 'Stock Operations',
        content: 'Handle stock transfers, adjustments, and inventory counts.'
      }
    ]
  }
];

export default function TutorialSection() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleTutorialSelect = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="space-y-6">
      {!selectedTutorial ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="p-4 hover:shadow-lg transition-shadow">
              <Typography variant="h6" gutterBottom>
                {tutorial.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-4">
                {tutorial.description}
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => handleTutorialSelect(tutorial)}
              >
                Start Tutorial
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <Button onClick={() => setSelectedTutorial(null)} className="mb-4">
            Back to Tutorials
          </Button>
          
          <Typography variant="h5" gutterBottom>
            {selectedTutorial.title}
          </Typography>
          
          <Box className="mt-4">
            <Stepper activeStep={activeStep}>
              {selectedTutorial.steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box className="mt-4 p-4 border rounded-lg">
              <Typography variant="h6" gutterBottom>
                {selectedTutorial.steps[activeStep].title}
              </Typography>
              <Typography variant="body1">
                {selectedTutorial.steps[activeStep].content}
              </Typography>
            </Box>
            
            <Box className="mt-4 flex justify-between">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Box>
                {activeStep === selectedTutorial.steps.length - 1 ? (
                  <Button onClick={handleReset} variant="contained" color="primary">
                    Restart Tutorial
                  </Button>
                ) : (
                  <Button onClick={handleNext} variant="contained" color="primary">
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
}