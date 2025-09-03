import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonDetails, getPersonCredits, PersonDetails, PersonCredits } from '@/utils/cast';
import { getImageUrl } from '@/utils/api';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Loader from '@/components/Loader';

const PersonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [credits, setCredits] = useState<PersonCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cast' | 'crew'>('cast');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchPersonData = async () => {
      setLoading(true);
      try {
        const [personData, creditsData] = await Promise.all([
          getPersonDetails(id),
          getPersonCredits(id)
        ]);
        
        setPerson(personData);
        setCredits(creditsData);
      } catch (error) {
        console.error('Error fetching person data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex justify-center items-center h-[70vh]">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white">Person not found</h1>
          <Button 
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const profileUrl = getImageUrl(person.profile_path, 'w500');
  const age = person.birthday ? 
    Math.floor((new Date().getTime() - new Date(person.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
    null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          className="text-white mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Profile Image */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden poster-shadow">
              {profileUrl ? (
                <img 
                  src={profileUrl} 
                  alt={person.name} 
                  className="w-full object-cover"
                />
              ) : (
                <div className="bg-gray-800 aspect-[2/3] flex items-center justify-center">
                  <span className="text-gray-400 text-6xl">👤</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Person Details */}
          <div className="md:col-span-2 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {person.name}
            </h1>
            
            <div className="space-y-3 mb-6">
              <div className="text-lg font-semibold text-blue-400">
                {person.known_for_department}
              </div>
              
              {person.birthday && (
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar size={16} />
                  <span>
                    {new Date(person.birthday).toLocaleDateString()}
                    {age && ` (${age} years old)`}
                    {person.deathday && ` - ${new Date(person.deathday).toLocaleDateString()}`}
                  </span>
                </div>
              )}
              
              {person.place_of_birth && (
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin size={16} />
                  <span>{person.place_of_birth}</span>
                </div>
              )}
            </div>
            
            {person.biography && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Biography</h3>
                <div className="text-white/80 leading-relaxed space-y-4">
                  {person.biography.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {person.also_known_as && person.also_known_as.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Also Known As</h3>
                <div className="flex flex-wrap gap-2">
                  {person.also_known_as.slice(0, 5).map((name, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Credits */}
        {credits && (credits.cast.length > 0 || credits.crew.length > 0) && (
          <div>
            <div className="flex gap-4 mb-6">
              <Button
                variant={activeTab === 'cast' ? 'default' : 'outline'}
                onClick={() => setActiveTab('cast')}
                className={activeTab === 'cast' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600 text-white'}
              >
                Acting ({credits.cast.length})
              </Button>
              <Button
                variant={activeTab === 'crew' ? 'default' : 'outline'}
                onClick={() => setActiveTab('crew')}
                className={activeTab === 'crew' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600 text-white'}
              >
                Crew ({credits.crew.length})
              </Button>
            </div>

            {activeTab === 'cast' && credits.cast.length > 0 && (
              <MediaGrid
                title="Known For (Acting)"
                medias={credits.cast}
              />
            )}

            {activeTab === 'crew' && credits.crew.length > 0 && (
              <MediaGrid
                title="Known For (Crew)"
                medias={credits.crew}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetailsPage;