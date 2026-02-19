import { Button } from '@/components/ui/button';
import { Category } from '../backend';
import { useAllCategoryMeta } from '../hooks/useQueries';

interface CategoryFilterProps {
  activeCategory: Category | 'all';
  onChange: (category: Category | 'all') => void;
}

export default function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  const { data: categoryMetaArray = [] } = useAllCategoryMeta();

  // Convert array to map for easy lookup
  const categoryMetaMap = new Map(categoryMetaArray);

  const getCategoryLabel = (category: Category): string => {
    const meta = categoryMetaMap.get(category);
    if (meta?.name) return meta.name;
    
    // Fallback to default labels
    switch (category) {
      case 'weddings': return 'Weddings';
      case 'preWedding': return 'Pre-Wedding';
      case 'receptions': return 'Receptions';
      default: return category;
    }
  };

  const categories: Array<{ value: Category | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'weddings' as Category, label: getCategoryLabel('weddings' as Category) },
    { value: 'preWedding' as Category, label: getCategoryLabel('preWedding' as Category) },
    { value: 'receptions' as Category, label: getCategoryLabel('receptions' as Category) },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((cat) => (
        <Button
          key={cat.value}
          variant={activeCategory === cat.value ? 'default' : 'outline'}
          onClick={() => onChange(cat.value)}
          className="px-6"
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
