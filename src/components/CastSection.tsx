import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCredits, CastMember, CrewMember } from '@/utils/cast';
import { getImageUrl } from '@/utils/api';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface CastSectionProps {
  mediaId: string;
  mediaType: 'movie' | 'tv';
}

const CastSection: React.FC<CastSectionProps> = ({ mediaId, mediaType }) => {
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCredits = async () => {
      setLoading(true);
      try {
        const credits = await getCredits(mediaId, mediaType);
        setCast(credits.cast);
        setCrew(credits.crew);
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [mediaId, mediaType]);

  const handlePersonClick = (personId: number) => {
    navigate(`/person/${personId}`);
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Cast & Crew</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg aspect-[2/3] mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cast.length === 0 && crew.length === 0) {
    return null;
  }

  // Key crew members to show
  const keyCrewJobs = ['Director', 'Producer', 'Executive Producer', 'Writer', 'Screenplay'];
  const keyCrew = crew.filter(member => keyCrewJobs.includes(member.job));

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Cast & Crew</h2>
      
      {/* Key Crew Members */}
      {keyCrew.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Key Crew</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyCrew.slice(0, 4).map((member) => (
              <div
                key={`${member.id}-${member.job}`}
                onClick={() => handlePersonClick(member.id)}
                className="cursor-pointer group"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
                  {member.profile_path ? (
                    <img
                      src={getImageUrl(member.profile_path, 'w500') || ''}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-white text-sm line-clamp-1">{member.name}</h4>
                <p className="text-gray-400 text-xs">{member.job}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cast Members */}
      {cast.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Cast</h3>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {cast.map((member) => (
                <CarouselItem key={member.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <div
                    onClick={() => handlePersonClick(member.id)}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
                      {member.profile_path ? (
                        <img
                          src={getImageUrl(member.profile_path, 'w500') || ''}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-4xl">👤</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-white text-sm line-clamp-1">{member.name}</h4>
                    <p className="text-gray-400 text-xs line-clamp-1">{member.character}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-black/50 border-none text-white hover:bg-black/70" />
            <CarouselNext className="right-2 bg-black/50 border-none text-white hover:bg-black/70" />
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default CastSection;