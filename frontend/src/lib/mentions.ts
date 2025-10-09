import { useState } from 'react';
import { User } from '@/types/types';

// Utility functions for mention handling
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

export function highlightMentions(text: string): string {
  return text.replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>');
}

export function parseMentions(text: string, users: User[]): string[] {
  const mentionUsernames = extractMentions(text);
  const userIds: string[] = [];
  
  mentionUsernames.forEach(username => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      userIds.push(user.id);
    }
  });
  
  return userIds;
}

// Hook for mention autocomplete
export function useMentionAutocomplete(users: User[]) {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentMention, setCurrentMention] = useState('');

  const handleTextChange = (text: string, cursorPosition: number) => {
    // Find if we're typing a mention
    const beforeCursor = text.substring(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      setCurrentMention(query);
      
      if (query.length > 0) {
        const filtered = users.filter(user => 
          user.username.toLowerCase().includes(query) ||
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query)
        ).slice(0, 5);
        
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions(users.slice(0, 5));
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
      setCurrentMention('');
    }
  };

  const selectSuggestion = (user: User, text: string, cursorPosition: number) => {
    const beforeCursor = text.substring(0, cursorPosition);
    const afterCursor = text.substring(cursorPosition);
    
    // Replace the partial mention with the full username
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const mentionStart = beforeCursor.lastIndexOf('@');
      const newText = 
        beforeCursor.substring(0, mentionStart) + 
        `@${user.username} ` + 
        afterCursor;
      
      setShowSuggestions(false);
      setCurrentMention('');
      
      return {
        newText,
        newCursorPosition: mentionStart + user.username.length + 2
      };
    }
    
    return { newText: text, newCursorPosition: cursorPosition };
  };

  return {
    suggestions,
    showSuggestions,
    currentMention,
    handleTextChange,
    selectSuggestion,
    closeSuggestions: () => setShowSuggestions(false)
  };
}