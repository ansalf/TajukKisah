import React, { useState, useEffect } from 'react';
import { ProjectInvitation, loadProjectsFromStorage, saveProjectsToStorage } from '../data/projectData';
import { useAuth } from '../lib/authContext';
import { dbService } from '../lib/dbService';
import { Button } from '../components/common/Button';
import { SafeImage } from '../components/common/SafeImage';
import {
  Plus,
  Edit3,
  Eye,
  Trash2,
  Sparkles,
  CheckCircle2,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Cloud,
  RefreshCw,
} from 'lucide-react';

interface WeddingDashboardProps {
  onNavigate: (path: string) => void;
}

export const WeddingDashboardPage: React.FC<WeddingDashboardProps> = ({ onNavigate }) => {
  const { user, isConfigured } = useAuth();
  const [projects, setProjects] = useState<ProjectInvitation[]>(loadProjectsFromStorage());
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Sync projects with Supabase if user is signed in
  useEffect(() => {
    if (user && isConfigured) {
      setIsLoadingDb(true);
      dbService.getUserWeddings(user.id).then(({ data, error }) => {
        setIsLoadingDb(false);
        if (error) {
          console.warn('Could not load remote weddings:', error);
          setSyncStatus('Local storage active (remote sync paused)');
        } else if (data && data.length > 0) {
          setProjects(data);
          saveProjectsToStorage(data);
          setSyncStatus('Synced with Supabase Cloud');
        } else {
          setSyncStatus('Ready to save to Supabase Cloud');
        }
      });
    }
  }, [user, isConfigured]);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/invitation/${slug}`;
    navigator.clipboard?.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your projects?`)) {
      if (user && isConfigured) {
        await dbService.deleteWedding(id);
      }
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveProjectsToStorage(updated);
    }
  };

  const handleCreateNew = () => {
    const newId = `proj-${Date.now()}`;
    const newProject: ProjectInvitation = {
      id: newId,
      slug: `wedding-${Date.now().toString().slice(-4)}`,
      title: 'Our Sacred Wedding Celebration',
      templateId: 'editorial-romance',
      status: 'draft',
      viewsCount: 0,
      rsvpsCount: 0,
      lastEdited: 'Just now',
      weddingData: {
        ...projects[0].weddingData,
        couple: {
          ...projects[0].weddingData.couple,
          groom: {
            fullName: 'Groom Full Name',
            shortName: 'Groom',
            father: 'Father of Groom',
            mother: 'Mother of Groom',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
          },
          bride: {
            fullName: 'Bride Full Name',
            shortName: 'Bride',
            father: 'Father of Bride',
            mother: 'Mother of Bride',
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          },
          monogram: 'G & B',
          quote: 'Two lives, two hearts, joined together in friendship, united forever in love.',
          quoteSource: 'Anonymous',
          storyNarrative: 'A new chapter begins together.',
        },
      },
      storyTimeline: projects[0].storyTimeline,
      gallery: projects[0].gallery,
      digitalGifts: projects[0].digitalGifts,
      features: projects[0].features,
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    saveProjectsToStorage(updated);
    onNavigate(`/editor/${newProject.id}`);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-warm-white)', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Dashboard Header Bar */}
      <section
        style={{
          paddingTop: '48px',
          paddingBottom: '36px',
          borderBottom: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-ivory-light)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--color-burgundy)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Atelier Client Suite
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 400,
                  color: 'var(--color-espresso)',
                  margin: 0,
                }}
              >
                Wedding Projects Dashboard
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="primary"
                size="md"
                icon={<Plus size={16} />}
                onClick={handleCreateNew}
              >
                Create New Invitation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ paddingTop: '40px' }}>
        <div className="container">
          {/* Storage / Cloud Status Pill */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: user ? 'rgba(74, 91, 69, 0.08)' : 'var(--color-ivory)',
              border: user ? '1px solid #4A5B45' : '1px solid rgba(199, 166, 106, 0.4)',
              borderRadius: '2px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '0.85rem',
              color: 'var(--color-charcoal-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user ? (
                <Cloud size={16} color="#4A5B45" style={{ flexShrink: 0 }} />
              ) : (
                <Sparkles size={16} color="var(--color-burgundy)" style={{ flexShrink: 0 }} />
              )}
              <span>
                {user ? (
                  <>
                    <strong>Cloud Connected:</strong> Logged in as <em>{user.email}</em>.{' '}
                    {syncStatus || 'Projects sync with Supabase PostgreSQL.'}
                  </>
                ) : (
                  <>
                    <strong>Local Demo Mode:</strong> Projects are currently saved to local storage. Sign in to synchronize your invitations directly to Supabase cloud database.
                  </>
                )}
              </span>
            </div>
            {isLoadingDb && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-gold-dark)' }}>
                <RefreshCw size={12} className="spin" /> Syncing...
              </span>
            )}
          </div>

          {/* Projects List / Grid */}
          {projects.length === 0 ? (
            /* Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                backgroundColor: 'var(--color-ivory)',
                border: '1px dashed var(--color-border-subtle)',
                borderRadius: '2px',
                maxWidth: '600px',
                margin: '40px auto',
              }}
            >
              <FileText size={48} color="var(--color-gold)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '8px' }}>
                No Wedding Invitations Yet
              </h3>
              <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
                Begin crafting your first editorial digital wedding invitation tailored to your romantic aesthetic.
              </p>
              <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={handleCreateNew}>
                Create Invitation Now
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {projects.map((project) => {
                const isPublished = project.status === 'published';
                const isCopied = copiedSlug === project.slug;

                return (
                  <div
                    key={project.id}
                    style={{
                      backgroundColor: 'var(--color-warm-white)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      padding: '24px',
                      boxShadow: '0 4px 16px rgba(42, 21, 27, 0.04)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                      alignItems: 'center',
                    }}
                  >
                    {/* Left: Project Vignette & Core Meta */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '90px',
                          height: '110px',
                          border: '1px solid var(--color-border-gold)',
                          padding: '3px',
                          backgroundColor: '#FFF',
                          flexShrink: 0,
                        }}
                      >
                        <SafeImage
                          src={project.weddingData.heroPhoto}
                          alt={project.title}
                          aspectRatio="3/4"
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontFamily: 'var(--font-sans)',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.12em',
                              padding: '2px 8px',
                              borderRadius: '2px',
                              backgroundColor: isPublished ? 'rgba(74, 91, 69, 0.12)' : 'rgba(101, 31, 50, 0.08)',
                              color: isPublished ? '#4A5B45' : 'var(--color-burgundy)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {isPublished ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                            {project.status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', textTransform: 'capitalize' }}>
                            • {project.templateId.replace('-', ' ')}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.4rem',
                            color: 'var(--color-espresso)',
                            marginBottom: '4px',
                          }}
                        >
                          {project.title}
                        </h3>

                        <p style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                          Couples: {project.weddingData.couple.groom.shortName} & {project.weddingData.couple.bride.shortName} • {project.weddingData.event.dateFormatted}
                        </p>

                        <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-muted)', opacity: 0.7, marginTop: '4px', display: 'block' }}>
                          Last modified {project.lastEdited}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Engagement Metrics */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '24px',
                        justifyContent: 'center',
                        padding: '16px 0',
                        borderLeft: '1px solid var(--color-border-subtle)',
                        borderRight: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.6rem',
                            fontWeight: 600,
                            color: 'var(--color-burgundy)',
                            display: 'block',
                            lineHeight: 1,
                          }}
                        >
                          {project.viewsCount}
                        </span>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>
                          Page Views
                        </span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.6rem',
                            fontWeight: 600,
                            color: 'var(--color-gold-dark)',
                            display: 'block',
                            lineHeight: 1,
                          }}
                        >
                          {project.rsvpsCount}
                        </span>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>
                          RSVP Confirmed
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Edit3 size={14} />}
                        onClick={() => onNavigate(`/editor/${project.id}`)}
                      >
                        Edit Details
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye size={14} />}
                        onClick={() => onNavigate(`/invitation/${project.slug}?template=${project.templateId}`)}
                      >
                        Preview
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={isCopied ? <Check size={14} /> : <Copy size={14} />}
                        onClick={() => handleCopyLink(project.slug)}
                        title="Copy public invitation link"
                      >
                        {isCopied ? 'Copied' : 'Share'}
                      </Button>

                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        style={{
                          padding: '8px',
                          color: '#DC2626',
                          opacity: 0.7,
                          borderRadius: '2px',
                          transition: 'opacity 0.2s ease',
                        }}
                        title="Delete Invitation Project"
                        aria-label={`Delete invitation project ${project.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
