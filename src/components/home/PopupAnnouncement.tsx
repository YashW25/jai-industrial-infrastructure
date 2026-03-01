import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

interface PopupData {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  link_text: string | null;
}

export const PopupAnnouncement = () => {
  // Popups disabled as they are not supported in the current schema
  return null;
};
