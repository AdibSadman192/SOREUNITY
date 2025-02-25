'use client';

import { useState } from 'react';
import { Card, Typography, Tabs, Tab, Box } from '@mui/material';
import TutorialSection from './components/TutorialSection';
import KnowledgeBase from '@/app/support/components/KnowledgeBase';
import HelpDesk from '@/app/support/components/HelpDesk';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`support-tabpanel-${index}`}
      aria-labelledby={`support-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SupportPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="p-6">
      <Typography variant="h4" component="h1" gutterBottom>
        Support & Onboarding
      </Typography>
      
      <Card className="mt-4">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="support tabs">
            <Tab label="Interactive Tutorials" />
            <Tab label="Knowledge Base" />
            <Tab label="Help Desk" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <TutorialSection />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <KnowledgeBase />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <HelpDesk />
        </TabPanel>
      </Card>
    </div>
  );
}