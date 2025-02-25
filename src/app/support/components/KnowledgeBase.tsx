'use client';

import { useState } from 'react';
import { Card, Typography, TextField, InputAdornment, Grid, Chip, IconButton } from '@mui/material';
import { Search as SearchIcon, BookmarkBorder as BookmarkIcon, Share as ShareIcon } from '@mui/icons-material';

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  tags: string[];
}

const articles: Article[] = [
  {
    id: 'setup-guide',
    title: 'Complete Setup Guide',
    category: 'Getting Started',
    excerpt: 'A comprehensive guide to setting up your STOREFRONT ERP system for the first time.',
    tags: ['setup', 'configuration', 'basics']
  },
  {
    id: 'inventory-best-practices',
    title: 'Inventory Management Best Practices',
    category: 'Inventory',
    excerpt: 'Learn the best practices for managing your inventory efficiently with STOREFRONT.',
    tags: ['inventory', 'management', 'optimization']
  },
  {
    id: 'financial-reporting',
    title: 'Financial Reporting Guide',
    category: 'Finance',
    excerpt: 'Understanding financial reports and analytics in STOREFRONT.',
    tags: ['finance', 'reporting', 'analytics']
  },
  {
    id: 'user-management',
    title: 'User Management and Permissions',
    category: 'Administration',
    excerpt: 'Learn how to manage users and set up proper access permissions.',
    tags: ['admin', 'users', 'security']
  }
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(articles.map(article => article.category)));

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            color={category === selectedCategory ? 'primary' : 'default'}
            variant={category === selectedCategory ? 'filled' : 'outlined'}
          />
        ))}
      </div>

      <Grid container spacing={3}>
        {filteredArticles.map((article) => (
          <Grid item xs={12} md={6} key={article.id}>
            <Card className="p-4 h-full hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>
                <div className="flex gap-2">
                  <IconButton size="small">
                    <BookmarkIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {article.excerpt}
              </Typography>
              
              <div className="mt-4 flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    onClick={() => setSearchQuery(tag)}
                  />
                ))}
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}