'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryButton } from './CategoryButton';
import { useRouter } from 'next/navigation';
import Toolbar from './Toolbar';

interface CategoryListProps {
  categoryList: string[];
  allPostCount: number;
  currentCategory?: string;
}

const CategoryList = ({ categoryList, allPostCount, currentCategory = 'All' }: CategoryListProps) => {
  const router = useRouter();

  const onCategoryChange = (value: string) => {
    if (value === 'All') {
      router.push('/blog');
    } else {
      router.push(`/blog/${value}`);
    }
  };
  return (
    <div className="flex-col flex gap-y-6 w-full">
      <section className="flex flex-col justify-center">
        <div className="text-5xl font-normal text-primary px-2">{`${currentCategory}`}</div>
        {/* <div className="text-2xl font-thin">{`
                ${
                  currentCategory === 'All'
                  ? allPostCount
                  : categoryList.find((category) => category.dirName === currentCategory)?.count || 0
                  } posts`}</div> */}
      </section>
      <section className="w-full hidden md:block pl-2">
        <div className="flex w-full justify-between items-center ">
          <ul className="flex gap-6">
            <CategoryButton href="/blog" isCurrent={currentCategory === 'All'} displayName="All" />
            {categoryList.map((cg, index) => (
              <CategoryButton key={index} href={`/blog/${cg}`} displayName={cg} isCurrent={cg === currentCategory} />
            ))}
          </ul>
          <Toolbar />
        </div>
      </section>
      <section className="mb-2 md:hidden px-2">
        <Select onValueChange={onCategoryChange} defaultValue={currentCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categoryList.map((cg, index) => (
              <SelectItem key={index} value={cg}>
                {cg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
    </div>
  );
};

export default CategoryList;
