import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { genres } from '@/utils/genres';
import { Search, Filter, X } from 'lucide-react';

interface AdvancedSearchProps {
  onClose?: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [yearRange, setYearRange] = useState([1990, 2024]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('popularity.desc');

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (query.trim()) params.set('q', query.trim());
    if (selectedGenre && selectedGenre !== 'all-genres') params.set('genre', selectedGenre);
    if (mediaType && mediaType !== 'all-types') params.set('type', mediaType);
    if (yearRange[0] !== 1990 || yearRange[1] !== 2024) {
      params.set('year_min', yearRange[0].toString());
      params.set('year_max', yearRange[1].toString());
    }
    if (ratingRange[0] !== 0 || ratingRange[1] !== 10) {
      params.set('rating_min', ratingRange[0].toString());
      params.set('rating_max', ratingRange[1].toString());
    }
    if (sortBy !== 'popularity.desc') params.set('sort', sortBy);

    navigate(`/search?${params.toString()}`);
    if (onClose) onClose();
  };

  const handleReset = () => {
    setQuery('');
    setSelectedGenre('all-genres');
    setMediaType('all-types');
    setYearRange([1990, 2024]);
    setRatingRange([0, 10]);
    setSortBy('popularity.desc');
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Filter size={20} />
          Advanced Search
        </h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X size={20} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Query */}
        <div className="md:col-span-2">
          <Label htmlFor="search-query" className="text-white">Search Term</Label>
          <Input
            id="search-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter movie or TV show name..."
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Genre */}
        <div>
          <Label className="text-white">Genre</Label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Any genre" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all-genres">Any genre</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.name} className="text-white">
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Media Type */}
        <div>
          <Label className="text-white">Type</Label>
          <Select value={mediaType} onValueChange={setMediaType}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Movies & TV Shows" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all-types" className="text-white">Movies & TV Shows</SelectItem>
              <SelectItem value="movie" className="text-white">Movies Only</SelectItem>
              <SelectItem value="tv" className="text-white">TV Shows Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Year Range */}
        <div>
          <Label className="text-white">Release Year</Label>
          <div className="px-3 py-2">
            <Slider
              value={yearRange}
              onValueChange={setYearRange}
              min={1950}
              max={2024}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Rating Range */}
        <div>
          <Label className="text-white">Rating (TMDB)</Label>
          <div className="px-3 py-2">
            <Slider
              value={ratingRange}
              onValueChange={setRatingRange}
              min={0}
              max={10}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>{ratingRange[0]}</span>
              <span>{ratingRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="md:col-span-2">
          <Label className="text-white">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="popularity.desc" className="text-white">Most Popular</SelectItem>
              <SelectItem value="popularity.asc" className="text-white">Least Popular</SelectItem>
              <SelectItem value="vote_average.desc" className="text-white">Highest Rated</SelectItem>
              <SelectItem value="vote_average.asc" className="text-white">Lowest Rated</SelectItem>
              <SelectItem value="release_date.desc" className="text-white">Newest First</SelectItem>
              <SelectItem value="release_date.asc" className="text-white">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 border-gray-600 text-white hover:bg-gray-800"
        >
          Reset
        </Button>
        <Button
          onClick={handleSearch}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          <Search size={16} className="mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSearch;