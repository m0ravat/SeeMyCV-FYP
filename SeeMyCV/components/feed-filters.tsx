"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, X, ArrowUpDown } from "lucide-react";

export interface FilterState {
  experienceLevels: string[];
  industries: string[];
  companies: string[];
  sortBy: string;
}

interface FeedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const experienceLevelOptions = [
  "Entry Level",
  "Mid Level",
  "Senior",
  "Executive",
];

const industryOptions = [
  "Technology",
  "Customer Service",
  "Education",
  "Finance",
  "Healthcare",
  "Marketing",
  "Engineering",
  "Design",
];

const companyOptions = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Startup",
  "Freelance",
];

const sortOptions = [
  { value: "upvotes", label: "Most Upvoted" },
  { value: "comments", label: "Most Comments" },
  { value: "recent", label: "Recently Added" },
];

export function FeedFilters({ filters, onFiltersChange }: FeedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExperienceChange = (level: string, checked: boolean) => {
    const newLevels = checked
      ? [...filters.experienceLevels, level]
      : filters.experienceLevels.filter((l) => l !== level);
    onFiltersChange({ ...filters, experienceLevels: newLevels });
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    const newIndustries = checked
      ? [...filters.industries, industry]
      : filters.industries.filter((i) => i !== industry);
    onFiltersChange({ ...filters, industries: newIndustries });
  };

  const handleCompanyChange = (company: string, checked: boolean) => {
    const newCompanies = checked
      ? [...filters.companies, company]
      : filters.companies.filter((c) => c !== company);
    onFiltersChange({ ...filters, companies: newCompanies });
  };

  const clearFilters = () => {
    onFiltersChange({
      experienceLevels: [],
      industries: [],
      companies: [],
      sortBy: "recent",
    });
  };

  const activeFilterCount =
    filters.experienceLevels.length +
    filters.industries.length +
    filters.companies.length;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Button with Popover */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filter CVs</h4>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Experience Level */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Experience Level
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {experienceLevelOptions.map((level) => (
                      <div key={level} className="flex items-center gap-2">
                        <Checkbox
                          id={`exp-${level}`}
                          checked={filters.experienceLevels.includes(level)}
                          onCheckedChange={(checked) =>
                            handleExperienceChange(level, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`exp-${level}`}
                          className="text-sm cursor-pointer"
                        >
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Industry
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {industryOptions.map((industry) => (
                      <div key={industry} className="flex items-center gap-2">
                        <Checkbox
                          id={`ind-${industry}`}
                          checked={filters.industries.includes(industry)}
                          onCheckedChange={(checked) =>
                            handleIndustryChange(industry, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`ind-${industry}`}
                          className="text-sm cursor-pointer"
                        >
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Company
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {companyOptions.map((company) => (
                      <div key={company} className="flex items-center gap-2">
                        <Checkbox
                          id={`comp-${company}`}
                          checked={filters.companies.includes(company)}
                          onCheckedChange={(checked) =>
                            handleCompanyChange(company, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`comp-${company}`}
                          className="text-sm cursor-pointer"
                        >
                          {company}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Active Filter Tags */}
          {filters.experienceLevels.map((level) => (
            <Badge
              key={level}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => handleExperienceChange(level, false)}
            >
              {level}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          {filters.industries.map((industry) => (
            <Badge
              key={industry}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => handleIndustryChange(industry, false)}
            >
              {industry}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          {filters.companies.map((company) => (
            <Badge
              key={company}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => handleCompanyChange(company, false)}
            >
              {company}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
