import csv
import os
from typing import List, Dict, Any
from pathlib import Path

class CSVLoader:
    """Load and parse CSV files from datasets directory"""
    
    DIFFICULTY_MAP = {
        'easy': 'Easy',
        'medium': 'Medium',
        'hard': 'Hard',
        'EASY': 'Easy',
        'MEDIUM': 'Medium',
        'HARD': 'Hard',
    }
    
    def __init__(self):
        self.backend_dir = Path(__file__).parent.parent.parent
        self.project_root = self.backend_dir.parent
        self.datasets_path = self.project_root / 'datasets' / 'raw'
        
        print(f"📁 Project root: {self.project_root}")
        print(f"📁 Datasets path: {self.datasets_path}")
    
    def load_csv(self, filename: str) -> List[Dict[str, Any]]:
        file_path = self.datasets_path / filename
        if not file_path.exists():
            print(f"⚠️ File not found: {file_path}")
            return []
        
        data = []
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    cleaned_row = self._clean_row(row, filename)
                    data.append(cleaned_row)
            print(f"✅ Loaded {len(data)} rows from {filename}")
        except Exception as e:
            print(f"❌ Error loading {filename}: {e}")
        
        return data
    
    def load_all_datasets(self) -> Dict[str, List[Dict[str, Any]]]:
        datasets = {}
        
        csv_files = ['arithmetic.csv', 'reasoning.csv', 'verbal.csv']
        subject_map = {
            'arithmetic': 'Arithmetic',
            'reasoning': 'Logical Reasoning',
            'verbal': 'Verbal Ability'
        }
        
        for filename in csv_files:
            data = self.load_csv(filename)
            if data:
                subject_key = filename.replace('.csv', '').lower()
                datasets[subject_map.get(subject_key, subject_key.capitalize())] = data
        
        return datasets
    
    def _clean_row(self, row: Dict[str, str], filename: str) -> Dict[str, Any]:
        """Clean and normalize a CSV row - FIXED to handle case-insensitive columns"""
        cleaned = {}
        
        # Get all column names from the row
        all_keys = list(row.keys())
        print(f"📋 Columns in {filename}: {all_keys}")
        
        # Normalize row: convert all keys to lowercase for lookup
        normalized_row = {}
        for key, value in row.items():
            normalized_row[key.lower().strip()] = value.strip() if value else ''
        
        # Map fields with case-insensitive lookup
        field_mappings = {
            'question_id': ['question_id', 'id'],
            'subject': ['subject'],
            'topic': ['topic'],
            'subtopic': ['subtopic', 'sub_topic', 'sub-topic'],
            'difficulty': ['difficulty', 'level'],
            'question': ['question', 'questions'],
            'option_a': ['option_a', 'option_a', 'a', 'opt_a'],
            'option_b': ['option_b', 'option_b', 'b', 'opt_b'],
            'option_c': ['option_c', 'option_c', 'c', 'opt_c'],
            'option_d': ['option_d', 'option_d', 'd', 'opt_d'],
            'correct_option': ['correct_option', 'correct_answer', 'answer', 'ans'],
            'hint': ['hint'],
            'formula': ['formula'],
            'explanation': ['explanation', 'solution']
        }
        
        for field, possible_keys in field_mappings.items():
            cleaned[field] = ''
            for key in possible_keys:
                if key in normalized_row and normalized_row[key]:
                    cleaned[field] = normalized_row[key]
                    break
        
        # Special handling for option columns if standard mapping failed
        if not cleaned['option_a']:
            # Try to find option columns by pattern
            for key in normalized_row.keys():
                if key.startswith('option_') or key.startswith('opt_') or key in ['a', 'b', 'c', 'd']:
                    if key.endswith('a') or key == 'a':
                        cleaned['option_a'] = normalized_row[key]
                    elif key.endswith('b') or key == 'b':
                        cleaned['option_b'] = normalized_row[key]
                    elif key.endswith('c') or key == 'c':
                        cleaned['option_c'] = normalized_row[key]
                    elif key.endswith('d') or key == 'd':
                        cleaned['option_d'] = normalized_row[key]
        
        # Normalize options array
        options = [
            cleaned.get('option_a', ''),
            cleaned.get('option_b', ''),
            cleaned.get('option_c', ''),
            cleaned.get('option_d', '')
        ]
        cleaned['options'] = options
        
        # Convert correct_option to integer (0-3)
        if cleaned.get('correct_option'):
            try:
                val = str(cleaned['correct_option']).upper().strip()
                if val in ['A', 'B', 'C', 'D']:
                    cleaned['correct_option'] = ord(val) - 65
                else:
                    cleaned['correct_option'] = int(val) - 1 if int(val) > 0 else 0
            except (ValueError, TypeError):
                cleaned['correct_option'] = 0
        else:
            cleaned['correct_option'] = 0
        
        # Normalize difficulty
        if cleaned.get('difficulty'):
            diff = cleaned['difficulty'].strip()
            if diff.lower() in ['easy', 'medium', 'hard']:
                cleaned['difficulty'] = self.DIFFICULTY_MAP.get(diff.lower(), 'Medium')
            else:
                cleaned['difficulty'] = 'Medium'
        else:
            cleaned['difficulty'] = 'Medium'
        
        # Ensure subject is set (from filename if missing)
        if not cleaned.get('subject') or cleaned['subject'] == '':
            if 'arithmetic' in filename.lower():
                cleaned['subject'] = 'Arithmetic'
            elif 'reasoning' in filename.lower():
                cleaned['subject'] = 'Logical Reasoning'
            elif 'verbal' in filename.lower():
                cleaned['subject'] = 'Verbal Ability'
        
        # Ensure all required fields exist
        required_fields = ['question', 'topic', 'subtopic', 'explanation']
        for field in required_fields:
            if field not in cleaned or not cleaned[field]:
                cleaned[field] = ''
                # For topic and subtopic, try to infer from filename
                if field == 'topic' and not cleaned.get(field):
                    # Try to find any column that might contain topic data
                    for key in normalized_row.keys():
                        if 'topic' in key.lower():
                            cleaned[field] = normalized_row[key]
                            break
                if field == 'subtopic' and not cleaned.get(field):
                    for key in normalized_row.keys():
                        if 'subtopic' in key.lower() or 'sub_topic' in key.lower():
                            cleaned[field] = normalized_row[key]
                            break
        
        return cleaned
    
    def get_subject_metadata(self) -> Dict[str, Dict]:
        return {
            'Arithmetic': {
                'name': 'Arithmetic',
                'icon': 'fa-calculator',
                'description': 'Master quantitative aptitude with comprehensive topic coverage',
                'color': '#667eea'
            },
            'Logical Reasoning': {
                'name': 'Logical Reasoning',
                'icon': 'fa-brain',
                'description': 'Enhance your logical and analytical thinking abilities',
                'color': '#f45c43'
            },
            'Verbal Ability': {
                'name': 'Verbal Ability',
                'icon': 'fa-comment-dots',
                'description': 'Improve your language skills for placement exams',
                'color': '#764ba2'
            }
        }

csv_loader = CSVLoader()