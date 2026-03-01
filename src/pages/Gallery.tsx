import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useOccasions } from '@/hooks/useSiteData';
import { useClubEvents } from '@/hooks/useClubData';
import { cn } from '@/lib/utils';
import { FolderOpen, Calendar, Sparkles, LayoutGrid } from 'lucide-react';
import { DriveGallery } from '@/components/gallery/DriveGallery';
import { format } from 'date-fns';
import { generateBreadcrumbSchema } from '@/lib/seo';

const occasionCategories = [
  { value: 'all', label: 'All' },
  { value: 'farewell', label: 'Farewell' },
  { value: 'teachers_day', label: 'Teachers Day' },
  { value: 'welcome', label: 'Welcome' },
  { value: 'annual_day', label: 'Annual Day' },
  { value: 'festival', label: 'Festival' },
  { value: 'sports_day', label: 'Sports Day' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'celebration', label: 'Celebration' },
];

type GalleryTab = 'all' | 'general' | 'events';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<GalleryTab>('all');
  const [occasionFilter, setOccasionFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<{ type: 'occasion' | 'event'; id: string } | null>(null);

  const { data: events } = useClubEvents();
  const { data: occasions } = useOccasions();

  const eventsWithGallery = events?.filter(event => event.drive_folder_link) || [];
  const occasionsWithGallery = occasions?.filter(occasion => occasion.drive_folder_link) || [];

  const allItems = [
    ...occasionsWithGallery.map(o => ({ ...o, itemType: 'occasion' as const })),
    ...eventsWithGallery.map(e => ({ ...e, itemType: 'event' as const, category: e.event_type }))
  ].sort((a, b) => {
    const dateA = a.itemType === 'occasion' ? a.occasion_date : a.event_date;
    const dateB = b.itemType === 'occasion' ? b.occasion_date : b.event_date;
    return new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime();
  });

  const filteredOccasions = occasionFilter === 'all'
    ? occasionsWithGallery
    : occasionsWithGallery.filter(o => o.category === occasionFilter);

  const viewingItem = selectedItem?.type === 'occasion'
    ? occasionsWithGallery.find(o => o.id === selectedItem.id)
    : eventsWithGallery.find(e => e.id === selectedItem?.id);

  const tabs = [
    { id: 'all' as GalleryTab, label: 'All', icon: LayoutGrid, count: allItems.length },
    { id: 'general' as GalleryTab, label: 'General', icon: Calendar, count: occasionsWithGallery.length },
    { id: 'events' as GalleryTab, label: 'Events', icon: FolderOpen, count: eventsWithGallery.length },
  ];

  const getCategoryLabel = (category: string | null | undefined) => {
    if (!category) return 'Other';
    const found = occasionCategories.find(c => c.value === category);
    return found?.label || category.replace('_', ' ');
  };

  const renderCard = (item: typeof allItems[0], index: number) => {
    const isOccasion = item.itemType === 'occasion';
    const date = isOccasion ? item.occasion_date : item.event_date;
    const imageUrl = isOccasion ? item.cover_image_url : item.image_url;

    return (
      <article
        key={item.id}
        onClick={() => setSelectedItem({ type: item.itemType, id: item.id })}
        className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in border border-border hover:border-primary/30 hover:-translate-y-1"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${item.title} - Innovation Cell ISBM gallery photo`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
              {isOccasion ? <Calendar className="w-16 h-16 text-primary/30" /> : <FolderOpen className="w-16 h-16 text-primary/30" />}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute top-3 left-3">
            <span className={cn(
              "text-xs font-semibold text-white backdrop-blur-sm px-3 py-1.5 rounded-full capitalize shadow-lg",
              isOccasion ? "bg-primary/90" : "bg-secondary/90"
            )}>
              {getCategoryLabel(item.category)}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg line-clamp-2 drop-shadow-md">{item.title}</h3>
            {date && (
              <p className="text-sm text-white/80 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(date), 'MMMM dd, yyyy')}
              </p>
            )}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Click to explore
            </span>
            <span className="text-primary font-medium">View â†’</span>
          </div>
        </div>
      </article>
    );
  };

  const renderDriveGalleryView = () => {
    if (!viewingItem) return null;
    const isOccasion = selectedItem?.type === 'occasion';
    const folderLink = isOccasion
      ? (viewingItem as typeof occasionsWithGallery[0]).drive_folder_link
      : (viewingItem as typeof eventsWithGallery[0]).drive_folder_link;
    const date = isOccasion
      ? (viewingItem as typeof occasionsWithGallery[0]).occasion_date
      : (viewingItem as typeof eventsWithGallery[0]).event_date;

    return (
      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button onClick={() => setSelectedItem(null)} className="text-sm text-primary hover:text-primary/80 font-medium mb-3 flex items-center gap-1 transition-colors">
              â† Back to galleries
            </button>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">{viewingItem.title}</h3>
            {date && (
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(date), 'MMMM dd, yyyy')}
              </p>
            )}
          </div>
          <span className={cn(
            "text-sm font-semibold text-white px-4 py-2 rounded-full capitalize self-start",
            isOccasion ? "bg-primary" : "bg-secondary"
          )}>
            {getCategoryLabel(isOccasion
              ? (viewingItem as typeof occasionsWithGallery[0]).category
              : (viewingItem as typeof eventsWithGallery[0]).event_type)}
          </span>
        </div>
        {folderLink && <DriveGallery folderUrl={folderLink} pageSize={16} />}
      </div>
    );
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Gallery', item: '/gallery' },
  ]);

  return (
    <MainLayout
      title="Gallery"
      description="Browse event photos, workshop highlights, hackathon moments, and campus innovation activities from the Innovation Cell at ISBM College of Engineering, Pune."
      keywords="Innovation Cell Gallery, ISBM Event Photos, Hackathon Photos Pune, Engineering College Gallery Maharashtra, Student Innovation Photos"
      schema={breadcrumbSchema}
    >
      {/* Hero */}
      <section className="py-20 gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Photo Gallery
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <p className="text-lg text-white/80">
              Capturing moments of innovation, learning, collaboration, and celebration
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedItem(null); setOccasionFilter('all'); }}
                  className={cn(
                    "flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      activeTab === tab.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-background min-h-[60vh]">
        <div className="container">
          {activeTab === 'general' && !selectedItem && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {occasionCategories.map((cat) => {
                const count = cat.value === 'all'
                  ? occasionsWithGallery.length
                  : occasionsWithGallery.filter(o => o.category === cat.value).length;
                if (count === 0 && cat.value !== 'all') return null;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setOccasionFilter(cat.value)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      occasionFilter === cat.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    {cat.label}
                    {count > 0 && <span className="ml-1.5 opacity-70">({count})</span>}
                  </button>
                );
              })}
            </div>
          )}

          {selectedItem ? renderDriveGalleryView() : (
            <>
              {activeTab === 'all' && (
                allItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allItems.map((item, index) => renderCard(item, index))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <LayoutGrid className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">No galleries yet</h3>
                    <p className="text-muted-foreground/70">Photo galleries will appear here</p>
                  </div>
                )
              )}
              {activeTab === 'general' && (
                filteredOccasions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredOccasions.map((occasion, index) => renderCard({ ...occasion, itemType: 'occasion' }, index))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Calendar className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">No occasions yet</h3>
                    <p className="text-muted-foreground/70">General event galleries will appear here</p>
                  </div>
                )
              )}
              {activeTab === 'events' && (
                eventsWithGallery.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {eventsWithGallery.map((event, index) => renderCard({ ...event, itemType: 'event', category: event.event_type }, index))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">No event galleries yet</h3>
                    <p className="text-muted-foreground/70">Event photo galleries will appear here</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Gallery;
