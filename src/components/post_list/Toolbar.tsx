'use client';

import { ChevronDown, ChevronUp, Settings2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export default function Toolbar() {
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false);

  // const [filters, setFilters] = useState({
  //   react: false,
  //   nextjs: false,
  //   private: false,
  // });
  // const [sortBy, setSortBy] = useState('latest');

  return (
    <div className="flex justify-center">
      <Popover
        open={isFilterPopoverOpen}
        onOpenChange={(open) => {
          setIsFilterPopoverOpen(open);
          if (open) setIsSortPopoverOpen(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button className="flex items-center gap-2 hover:bg-transparent hover:text-zinc-600 dark:hover:text-zinc-400" variant="ghost">
            필터링
            {isFilterPopoverOpen ? <X size={18} /> : <Settings2 size={18} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-1">
          <div className="grid gap-2">
            <Label className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent group">
              <Checkbox id="react" />
              <span className="group-hover:text-primary">React</span>
            </Label>
          </div>
        </PopoverContent>
      </Popover>

      <Popover
        open={isSortPopoverOpen}
        onOpenChange={(open) => {
          setIsSortPopoverOpen(open);
          if (open) setIsFilterPopoverOpen(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button className="flex items-center gap-2 hover:bg-transparent hover:text-zinc-600 dark:hover:text-zinc-400" variant="ghost">
            정렬
            {isSortPopoverOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-1">
          <RadioGroup defaultValue="latest" className="grid gap-2">
            <Label className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent group">
              <RadioGroupItem value="latest" id="latest" />
              <span className="group-hover:text-primary">최신순</span>
            </Label>
            <Label className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent group">
              <RadioGroupItem value="oldest" id="oldest" />
              <span className="group-hover:text-primary">오래된순</span>
            </Label>
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}
