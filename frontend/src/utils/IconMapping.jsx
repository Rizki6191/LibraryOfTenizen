// src/utils/IconMapping.js
import { 
    Book, 
    Heart, 
    GraduationCap, 
    Users, 
    Search, 
    AlertCircle, 
    TrendingUp,
    BookOpen
} from 'lucide-react';

export const CATEGORY_ICON_MAPPING = {
    'Romansa': Heart,
    'Self-Help': GraduationCap,
    'Biografi': Users,
    'Fantasi': Book,
    'Fiksi Ilmiah': Search,
    'Misteri': AlertCircle,
    'Thriller': TrendingUp,
    'Horor': AlertCircle,
    'Sejarah': BookOpen,
    'Bisnis': TrendingUp,
    'Kesehatan & Kebugaran': Users,
    'Anak-Anak': Book,
    'Drama': Heart,
    'Slice of Life': BookOpen
};

export const getCategoryIcon = (categoryName) => {
    return CATEGORY_ICON_MAPPING[categoryName] || Book;
};