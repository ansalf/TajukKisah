import React, { useState } from 'react';
import {
  ProjectInvitation,
  loadProjectsFromStorage,
  saveProjectsToStorage,
} from '../data/projectData';
import { TEMPLATES_DATA } from '../data/mockData';
import { Button } from '../components/common/Button';
import { SafeImage } from '../components/common/SafeImage';
import {
  Save,
  ArrowLeft,
  Eye,
  Heart,
  Calendar,
  Clock,
  Music,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  Gift,
  Plus,
  Sliders,
  Share2,
  Copy,
  AlertCircle,
  Globe,
  Smartphone,
  Monitor,
} from 'lucide-react';

import { useAuth } from '../lib/authContext';
import { dbService } from '../lib/dbService';

interface InvitationEditorProps {
  projectId: string;
  initialTemplateId?: 'editorial-romance' | 'modern-botanical' | 'dark-luxury' | 'velvet-noir-editorial';
  onNavigate: (path: string) => void;
}

export const InvitationEditorPage: React.FC<InvitationEditorProps> = ({
  projectId,
  initialTemplateId,
  onNavigate,
}) => {
  const { user, isConfigured } = useAuth();
  const projects = loadProjectsFromStorage();
  const currentProject = projects.find((p) => p.id === projectId) || projects[0];

  const [project, setProject] = useState<ProjectInvitation>(() => {
    if (initialTemplateId && initialTemplateId !== currentProject.templateId) {
      return { ...currentProject, templateId: initialTemplateId };
    }
    return currentProject;
  });

  const [activeTab, setActiveTab] = useState<
    'couple' | 'event' | 'story' | 'gallery' | 'theme' | 'features' | 'gifts' | 'publish'
  >(initialTemplateId ? 'theme' : 'couple');
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewViewport, setPreviewViewport] = useState<'mobile' | 'desktop'>('mobile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const couple = project.weddingData.couple;
  const event = project.weddingData.event;

  const handleSave = async () => {
    setIsSavingDb(true);
    setSaveError(null);

    // 1. Always update local storage for immediate responsiveness
    const updatedProjects = projects.map((p) =>
      p.id === project.id
        ? { ...project, lastEdited: 'Just now' }
        : p
    );
    saveProjectsToStorage(updatedProjects);

    // 2. Persist to Supabase if user is logged in
    if (user && isConfigured) {
      const { error } = await dbService.saveWedding(user.id, project);
      if (error) {
        console.warn('Supabase save error:', error);
        setSaveError('Saved to local storage. (Supabase cloud sync error: ' + error.message + ')');
      }
    }

    setIsSavingDb(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Helper updater
  const updateProject = (updater: (prev: ProjectInvitation) => ProjectInvitation) => {
    setProject((prev) => updater(prev));
  };

  const [slugStatus, setSlugStatus] = useState<'idle' | 'valid' | 'conflict'>('idle');

  const togglePublish = async () => {
    const nextStatus: 'published' | 'draft' = project.status === 'published' ? 'draft' : 'published';
    updateProject((prev) => ({ ...prev, status: nextStatus }));

    // Persist locally
    const updatedProjects = projects.map((p) =>
      p.id === project.id ? { ...project, status: nextStatus, lastEdited: 'Just now' } : p
    );
    saveProjectsToStorage(updatedProjects);

    // Persist to Supabase if logged in
    if (user && isConfigured) {
      await dbService.togglePublishWedding(project.id, nextStatus);
    }
  };

  const handleSlugChange = async (newSlug: string) => {
    const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');
    updateProject((prev) => ({ ...prev, slug: cleanSlug }));

    if (cleanSlug.length > 2) {
      const isAvailable = await dbService.checkSlugAvailability(cleanSlug, project.id);
      setSlugStatus(isAvailable ? 'valid' : 'conflict');
    } else {
      setSlugStatus('idle');
    }
  };

  const tabs = [
    { id: 'couple', label: 'Bride & Groom', icon: <Heart size={14} /> },
    { id: 'event', label: 'Ceremony & Venue', icon: <Calendar size={14} /> },
    { id: 'story', label: 'Love Story', icon: <Clock size={14} /> },
    { id: 'gallery', label: 'Photo Gallery', icon: <ImageIcon size={14} /> },
    { id: 'theme', label: 'Theme & Style', icon: <Sliders size={14} /> },
    { id: 'features', label: 'RSVP & Music', icon: <Music size={14} /> },
    { id: 'gifts', label: 'Digital Registry', icon: <Gift size={14} /> },
    { id: 'publish', label: 'Publish & Link', icon: <Share2 size={14} /> },
  ] as const;

  return (
    <div style={{ backgroundColor: 'var(--color-warm-white)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Editor Bar */}
      <header
        style={{
          position: 'sticky',
          top: '80px',
          zIndex: 40,
          backgroundColor: '#FFFCF7',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '12px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Breadcrumbs & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => onNavigate('/dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8125rem',
                color: 'var(--color-espresso)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <ArrowLeft size={14} />
              <span>Dashboard</span>
            </button>
            <span style={{ color: 'var(--color-border-subtle)' }}>•</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 500 }}>
              {project.title}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '2px 8px',
                backgroundColor: project.status === 'published' ? 'rgba(74, 91, 69, 0.12)' : 'rgba(101, 31, 50, 0.08)',
                color: project.status === 'published' ? '#4A5B45' : 'var(--color-burgundy)',
                borderRadius: '2px',
                fontWeight: 600,
              }}
            >
              {project.status}
            </span>
          </div>

          {/* Controls: Preview Toggle & Save */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8125rem',
                padding: '8px 14px',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '2px',
                color: 'var(--color-espresso)',
                backgroundColor: showLivePreview ? 'var(--color-ivory)' : 'transparent',
              }}
            >
              <Eye size={14} />
              <span className="hide-on-mobile">{showLivePreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              icon={<Eye size={14} />}
              onClick={() => onNavigate(`/invitation/${project.slug}?template=${project.templateId}`)}
            >
              Open Full View
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={isSavingDb}
              icon={saveSuccess ? <Check size={14} /> : <Save size={14} />}
              onClick={handleSave}
            >
              {isSavingDb ? 'Syncing...' : saveSuccess ? 'Saved' : 'Save Changes'}
            </Button>
          </div>
        </div>
        {saveError && (
          <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', padding: '6px 24px', fontSize: '0.8rem', color: '#DC2626', borderTop: '1px solid rgba(220, 38, 38, 0.2)' }}>
            {saveError}
          </div>
        )}
      </header>

      {/* Editor Main Content Split View */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showLivePreview ? '1fr clamp(360px, 42vw, 540px)' : '1fr',
          flex: 1,
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
        }}
        className="editor-grid-layout"
      >
        {/* Left: Editor Controls and Form Tabs */}
        <div
          style={{
            padding: '28px clamp(16px, 4vw, 36px)',
            borderRight: showLivePreview ? '1px solid var(--color-border-subtle)' : 'none',
            overflowY: 'auto',
          }}
        >
          {/* Section Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '16px',
              marginBottom: '28px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '2px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    border: isActive ? '1px solid var(--color-burgundy)' : '1px solid var(--color-border-subtle)',
                    backgroundColor: isActive ? 'var(--color-burgundy)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'var(--color-espresso)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: BRIDE & GROOM PROFILES */}
          {activeTab === 'couple' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)' }}>
                Couple Profiles & Family Information
              </h3>

              {/* Monogram & Quote */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Couple Monogram
                  </label>
                  <input
                    type="text"
                    value={couple.monogram}
                    onChange={(e) =>
                      updateProject((prev) => ({
                        ...prev,
                        weddingData: {
                          ...prev.weddingData,
                          couple: { ...prev.weddingData.couple, monogram: e.target.value },
                        },
                      }))
                    }
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-subtle)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Hero Photo URL
                  </label>
                  <input
                    type="text"
                    value={project.weddingData.heroPhoto}
                    onChange={(e) =>
                      updateProject((prev) => ({
                        ...prev,
                        weddingData: { ...prev.weddingData, heroPhoto: e.target.value },
                      }))
                    }
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-subtle)' }}
                  />
                </div>
              </div>

              {/* Groom Details */}
              <div style={{ padding: '20px', border: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-burgundy)', marginBottom: '12px' }}>
                  Groom Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={couple.groom.fullName}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            couple: {
                              ...prev.weddingData.couple,
                              groom: { ...prev.weddingData.couple.groom, fullName: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Short / Nickname
                    </label>
                    <input
                      type="text"
                      value={couple.groom.shortName}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            couple: {
                              ...prev.weddingData.couple,
                              groom: { ...prev.weddingData.couple.groom, shortName: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={couple.groom.father}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            couple: {
                              ...prev.weddingData.couple,
                              groom: { ...prev.weddingData.couple.groom, father: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={couple.groom.mother}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            couple: {
                              ...prev.weddingData.couple,
                              groom: { ...prev.weddingData.couple.groom, mother: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Bride Details */}
              <div style={{ padding: '20px', border: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-burgundy)', marginBottom: '12px' }}>
                  Bride Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={couple.bride.fullName}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            couple: {
                              ...prev.weddingData.couple,
                              bride: { ...prev.weddingData.couple.bride, fullName: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Short / Nickname
                    </label>
                    <input
                      type="text"
                      value={couple.bride.shortName}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            couple: {
                              ...prev.weddingData.couple,
                              bride: { ...prev.weddingData.couple.bride, shortName: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={couple.bride.father}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            couple: {
                              ...prev.weddingData.couple,
                              bride: { ...prev.weddingData.couple.bride, father: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={couple.bride.mother}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            couple: {
                              ...prev.weddingData.couple,
                              bride: { ...prev.weddingData.couple.bride, mother: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Sacred Quote or Vow
                </label>
                <textarea
                  rows={2}
                  value={couple.quote}
                  onChange={(e) =>
                    updateProject((prev) => ({
                      ...prev,
                      weddingData: {
                        ...prev.weddingData,
                        couple: { ...prev.weddingData.couple, quote: e.target.value },
                      },
                    }))
                  }
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: CEREMONY & VENUE */}
          {activeTab === 'event' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)' }}>
                Ceremony & Reception Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Formatted Date
                  </label>
                  <input
                    type="text"
                    value={event.dateFormatted}
                    onChange={(e) =>
                      updateProject((prev) => ({
                        ...prev,
                        weddingData: {
                          ...prev.weddingData,
                          event: { ...prev.weddingData.event, dateFormatted: e.target.value },
                        },
                      }))
                    }
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                    ISO Date (Countdown target)
                  </label>
                  <input
                    type="text"
                    value={event.calendarDate}
                    onChange={(e) =>
                      updateProject((prev) => ({
                        ...prev,
                        weddingData: {
                          ...prev.weddingData,
                          event: { ...prev.weddingData.event, calendarDate: e.target.value },
                        },
                      }))
                    }
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                  />
                </div>
              </div>

              {/* Akad/Matrimony */}
              <div style={{ padding: '20px', border: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-burgundy)', marginBottom: '12px' }}>
                  Matrimony / Akad Nikah
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Time</label>
                    <input
                      type="text"
                      value={event.holyMatrimony.time}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            event: {
                              ...prev.weddingData.event,
                              holyMatrimony: { ...prev.weddingData.event.holyMatrimony, time: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Venue Name</label>
                    <input
                      type="text"
                      value={event.holyMatrimony.venue}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            event: {
                              ...prev.weddingData.event,
                              holyMatrimony: { ...prev.weddingData.event.holyMatrimony, venue: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Address</label>
                    <input
                      type="text"
                      value={event.holyMatrimony.address}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            event: {
                              ...prev.weddingData.event,
                              holyMatrimony: { ...prev.weddingData.event.holyMatrimony, address: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Reception */}
              <div style={{ padding: '20px', border: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-burgundy)', marginBottom: '12px' }}>
                  Wedding Reception
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Time</label>
                    <input
                      type="text"
                      value={event.reception.time}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            event: {
                              ...prev.weddingData.event,
                              reception: { ...prev.weddingData.event.reception, time: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Venue Name</label>
                    <input
                      type="text"
                      value={event.reception.venue}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            event: {
                              ...prev.weddingData.event,
                              reception: { ...prev.weddingData.event.reception, venue: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Address</label>
                    <input
                      type="text"
                      value={event.reception.address}
                      onChange={(e) =>
                        updateProject((prev) => ({
                          ...prev,
                          weddingData: {
                            ...prev.weddingData,
                            event: {
                              ...prev.weddingData.event,
                              reception: { ...prev.weddingData.event.reception, address: e.target.value },
                            },
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOVE STORY */}
          {activeTab === 'story' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)' }}>
                  Love Story Timeline
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() =>
                    updateProject((prev) => ({
                      ...prev,
                      storyTimeline: [
                        ...prev.storyTimeline,
                        { year: '2026', title: 'New Chapter', location: 'Location', narrative: 'Story text here...' },
                      ],
                    }))
                  }
                >
                  Add Milestone
                </Button>
              </div>

              {project.storyTimeline.map((item, idx) => (
                <div key={idx} style={{ padding: '16px', border: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF', position: 'relative' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProject((prev) => {
                          const updated = [...prev.storyTimeline];
                          updated[idx].year = val;
                          return { ...prev, storyTimeline: updated };
                        });
                      }}
                      style={{ padding: '6px 8px', border: '1px solid var(--color-border-subtle)' }}
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProject((prev) => {
                          const updated = [...prev.storyTimeline];
                          updated[idx].title = val;
                          return { ...prev, storyTimeline: updated };
                        });
                      }}
                      style={{ padding: '6px 8px', border: '1px solid var(--color-border-subtle)' }}
                    />
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProject((prev) => {
                          const updated = [...prev.storyTimeline];
                          updated[idx].location = val;
                          return { ...prev, storyTimeline: updated };
                        });
                      }}
                      style={{ padding: '6px 8px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={item.narrative}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateProject((prev) => {
                        const updated = [...prev.storyTimeline];
                        updated[idx].narrative = val;
                        return { ...prev, storyTimeline: updated };
                      });
                    }}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--color-border-subtle)', fontFamily: 'inherit' }}
                  />
                  {project.storyTimeline.length > 1 && (
                    <button
                      onClick={() =>
                        updateProject((prev) => ({
                          ...prev,
                          storyTimeline: prev.storyTimeline.filter((_, i) => i !== idx),
                        }))
                      }
                      style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '6px', cursor: 'pointer' }}
                    >
                      Remove Milestone
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === 'gallery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)' }}>
                  Wedding Photo Gallery
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() =>
                    updateProject((prev) => ({
                      ...prev,
                      gallery: [
                        ...prev.gallery,
                        {
                          id: `gal-${Date.now()}`,
                          src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                          alt: 'New wedding photo',
                          caption: 'A precious moment together',
                          location: 'Jakarta',
                        },
                      ],
                    }))
                  }
                >
                  Add Photo
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {project.gallery.map((photo, idx) => (
                  <div key={photo.id} style={{ border: '1px solid var(--color-border-subtle)', padding: '10px', backgroundColor: '#FFFFFF' }}>
                    <SafeImage src={photo.src} alt={photo.alt} aspectRatio="4/3" />
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input
                        type="text"
                        value={photo.caption}
                        placeholder="Caption"
                        onChange={(e) => {
                          const val = e.target.value;
                          updateProject((prev) => {
                            const updated = [...prev.gallery];
                            updated[idx].caption = val;
                            return { ...prev, gallery: updated };
                          });
                        }}
                        style={{ padding: '6px', fontSize: '0.8rem', border: '1px solid var(--color-border-subtle)' }}
                      />
                      <input
                        type="text"
                        value={photo.src}
                        placeholder="Image URL"
                        onChange={(e) => {
                          const val = e.target.value;
                          updateProject((prev) => {
                            const updated = [...prev.gallery];
                            updated[idx].src = val;
                            return { ...prev, gallery: updated };
                          });
                        }}
                        style={{ padding: '6px', fontSize: '0.75rem', border: '1px solid var(--color-border-subtle)' }}
                      />
                      {project.gallery.length > 1 && (
                        <button
                          onClick={() =>
                            updateProject((prev) => ({
                              ...prev,
                              gallery: prev.gallery.filter((_, i) => i !== idx),
                            }))
                          }
                          style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', textAlign: 'left' }}
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: THEME SELECTION */}
          {activeTab === 'theme' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)' }}>
                Template & Art Direction Selection
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {TEMPLATES_DATA.map((t) => {
                  const isSelected = project.templateId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() =>
                        updateProject((prev) => ({
                          ...prev,
                          templateId: t.id,
                        }))
                      }
                      style={{
                        padding: '16px',
                        border: isSelected ? '2px solid var(--color-burgundy)' : '1px solid var(--color-border-subtle)',
                        backgroundColor: t.paletteTheme.background,
                        cursor: 'pointer',
                        borderRadius: '2px',
                        boxShadow: isSelected ? '0 4px 16px rgba(101, 31, 50, 0.12)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: t.paletteTheme.accent, fontWeight: 600 }}>
                          {t.paletteTheme.badge}
                        </span>
                        {isSelected && <CheckCircle2 size={16} color="var(--color-burgundy)" />}
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: t.paletteTheme.text }}>
                        {t.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: t.paletteTheme.text, opacity: 0.8, marginTop: '4px' }}>
                        {t.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: FEATURES & AUDIO */}
          {activeTab === 'features' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)' }}>
                Interactive Features & Music Soundtrack
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid var(--color-border-subtle)' }}>
                {[
                  { key: 'showRsvp', label: 'RSVP Confirmation Form' },
                  { key: 'showGuestWishes', label: 'Guestbook Wishes Feed' },
                  { key: 'showAudio', label: 'Floating Music Soundtrack Button' },
                  { key: 'showStory', label: 'Love Story Timeline' },
                  { key: 'showGallery', label: 'Interactive Photo Gallery' },
                  { key: 'showCountdown', label: 'Wedding Countdown' },
                  { key: 'showGift', label: 'Digital Gift / Bank Account Section' },
                ].map((item) => (
                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(project.features as any)[item.key]}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        updateProject((prev) => ({
                          ...prev,
                          features: { ...prev.features, [item.key]: checked },
                        }));
                      }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Curated Licensed Wedding Soundtracks
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {[
                    {
                      id: 'piano-romance',
                      title: 'Acoustic Wedding Piano (Gentle & Romantic)',
                      artist: 'Pixabay Free Music License',
                      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113222.mp3',
                    },
                    {
                      id: 'classical-strings',
                      title: 'Canon in D (Orchestral Strings)',
                      artist: 'Johann Pachelbel (Public Domain)',
                      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8872b22.mp3?filename=canon-in-d-major-romantic-10855.mp3',
                    },
                    {
                      id: 'acoustic-guitar-vow',
                      title: 'Acoustic Guitar Romance',
                      artist: 'Pixabay Free Music License',
                      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=soft-acoustic-guitar-15243.mp3',
                    },
                  ].map((track) => {
                    const isSelected = project.features.audioUrl === track.url;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() =>
                          updateProject((prev) => ({
                            ...prev,
                            features: { ...prev.features, audioUrl: track.url },
                          }))
                        }
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          border: isSelected ? '1.5px solid var(--color-burgundy)' : '1px solid var(--color-border-subtle)',
                          backgroundColor: isSelected ? 'var(--color-ivory)' : '#FFFFFF',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
                            {track.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>
                            {track.artist}
                          </div>
                        </div>
                        {isSelected && <span style={{ fontSize: '0.75rem', color: 'var(--color-burgundy)', fontWeight: 600 }}>Active</span>}
                      </button>
                    );
                  })}
                </div>

                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Or Custom Audio MP3 URL (Customer-Provided or Licensed)
                </label>
                <input
                  type="text"
                  value={project.features.audioUrl}
                  placeholder="https://..."
                  onChange={(e) =>
                    updateProject((prev) => ({
                      ...prev,
                      features: { ...prev.features, audioUrl: e.target.value },
                    }))
                  }
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)' }}
                />
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-charcoal-muted)', marginTop: '4px' }}>
                  Ensure audio files are properly licensed or client-authorized. Mobile data optimized MP3 formats recommended.
                </span>
              </div>
            </div>
          )}

          {/* TAB 7: DIGITAL GIFTS */}
          {activeTab === 'gifts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)' }}>
                Digital Gifts & Bank Information
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Registry Description
                </label>
                <textarea
                  rows={2}
                  value={project.digitalGifts.description}
                  onChange={(e) =>
                    updateProject((prev) => ({
                      ...prev,
                      digitalGifts: { ...prev.digitalGifts, description: e.target.value },
                    }))
                  }
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-subtle)', fontFamily: 'inherit' }}
                />
              </div>

              {project.digitalGifts.accounts.map((acc, idx) => (
                <div key={idx} style={{ padding: '16px', border: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    <input
                      type="text"
                      value={acc.bankName}
                      placeholder="Bank Name"
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProject((prev) => {
                          const accounts = [...prev.digitalGifts.accounts];
                          accounts[idx].bankName = val;
                          return { ...prev, digitalGifts: { ...prev.digitalGifts, accounts } };
                        });
                      }}
                      style={{ padding: '6px 8px', border: '1px solid var(--color-border-subtle)' }}
                    />
                    <input
                      type="text"
                      value={acc.accountNumber}
                      placeholder="Account Number"
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProject((prev) => {
                          const accounts = [...prev.digitalGifts.accounts];
                          accounts[idx].accountNumber = val;
                          return { ...prev, digitalGifts: { ...prev.digitalGifts, accounts } };
                        });
                      }}
                      style={{ padding: '6px 8px', border: '1px solid var(--color-border-subtle)' }}
                    />
                    <input
                      type="text"
                      value={acc.accountHolder}
                      placeholder="Account Holder"
                      onChange={(e) => {
                        const val = e.target.value;
                        updateProject((prev) => {
                          const accounts = [...prev.digitalGifts.accounts];
                          accounts[idx].accountHolder = val;
                          return { ...prev, digitalGifts: { ...prev.digitalGifts, accounts } };
                        });
                      }}
                      style={{ padding: '6px 8px', border: '1px solid var(--color-border-subtle)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 8: PUBLISH & LINK */}
          {activeTab === 'publish' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)' }}>
                  Publishing & Guest Distribution
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', marginTop: '4px' }}>
                  Manage the public link and visibility of your wedding invitation.
                </p>
              </div>

              {/* Status Box */}
              <div
                style={{
                  padding: '24px',
                  backgroundColor: project.status === 'published' ? 'rgba(74, 91, 69, 0.08)' : 'var(--color-ivory)',
                  border: project.status === 'published' ? '1.5px solid #4A5B45' : '1px solid var(--color-border-subtle)',
                  borderRadius: '2px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={18} color={project.status === 'published' ? '#4A5B45' : 'var(--color-burgundy)'} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Publication Status: <strong style={{ color: project.status === 'published' ? '#4A5B45' : 'var(--color-burgundy)' }}>{project.status.toUpperCase()}</strong>
                    </span>
                  </div>
                  <Button
                    variant={project.status === 'published' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={togglePublish}
                  >
                    {project.status === 'published' ? 'Unpublish to Draft' : 'Publish Invitation Now'}
                  </Button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  {project.status === 'published'
                    ? 'Your invitation is live and publicly accessible by anyone with the link or personalized guest URL.'
                    : 'Your invitation is currently in private draft mode. Public visitors cannot view the invitation content until published.'}
                </p>
              </div>

              {/* Custom URL Slug */}
              <div style={{ padding: '20px', border: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Custom Wedding URL Slug
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                    /wedding/
                  </span>
                  <input
                    type="text"
                    value={project.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: slugStatus === 'conflict' ? '1px solid #DC2626' : '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                  {slugStatus === 'valid' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4A5B45', fontSize: '0.75rem' }}>
                      <Check size={14} /> Available
                    </span>
                  )}
                  {slugStatus === 'conflict' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.75rem' }}>
                      <AlertCircle size={14} /> Already taken
                    </span>
                  )}
                </div>
              </div>

              {/* Public Link Generator & Personalized Generator */}
              <div style={{ padding: '20px', border: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '8px' }}>
                  Personalized Guest Link Generator
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', marginBottom: '16px' }}>
                  Generate custom links that render the guest's name directly on the invitation cover:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--color-ivory)', border: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Standard Public Link:
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <code style={{ fontSize: '0.8rem', color: 'var(--color-burgundy)' }}>
                        {`${window.location.origin}/wedding/${project.slug}`}
                      </code>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Copy size={12} />}
                        onClick={() => {
                          navigator.clipboard?.writeText(`${window.location.origin}/wedding/${project.slug}`);
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--color-ivory)', border: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Sample Personalized Guest Link:
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <code style={{ fontSize: '0.8rem', color: 'var(--color-burgundy)' }}>
                        {`${window.location.origin}/wedding/${project.slug}?to=Bapak+Budi+%26+Partner`}
                      </code>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Copy size={12} />}
                        onClick={() => {
                          navigator.clipboard?.writeText(`${window.location.origin}/wedding/${project.slug}?to=Bapak+Budi+%26+Partner`);
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Real-time Live Preview Frame */}
        {showLivePreview && (
          <div
            style={{
              padding: '24px 20px',
              backgroundColor: 'var(--color-ivory)',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 140px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            className="editor-preview-column"
          >
            {/* Viewport switch controls */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px',
                backgroundColor: 'rgba(101, 31, 50, 0.06)',
                borderRadius: '4px',
                marginBottom: '16px',
              }}
            >
              <button
                onClick={() => setPreviewViewport('mobile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  borderRadius: '2px',
                  border: 'none',
                  backgroundColor: previewViewport === 'mobile' ? '#FFFFFF' : 'transparent',
                  color: previewViewport === 'mobile' ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                  boxShadow: previewViewport === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <Smartphone size={13} />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setPreviewViewport('desktop')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  borderRadius: '2px',
                  border: 'none',
                  backgroundColor: previewViewport === 'desktop' ? '#FFFFFF' : 'transparent',
                  color: previewViewport === 'desktop' ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                  boxShadow: previewViewport === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <Monitor size={13} />
                <span>Desktop</span>
              </button>
            </div>

            {/* Scaled Invitation Preview Container */}
            <div
              style={{
                width: previewViewport === 'mobile' ? '360px' : '100%',
                maxWidth: previewViewport === 'mobile' ? '360px' : '520px',
                backgroundColor:
                  TEMPLATES_DATA.find((t) => t.id === project.templateId)?.paletteTheme.surface || '#FFFFFF',
                border: '1px solid rgba(199, 166, 106, 0.4)',
                padding: '24px',
                borderRadius: previewViewport === 'mobile' ? '24px' : '2px',
                boxShadow: previewViewport === 'mobile'
                  ? '0 20px 48px rgba(42, 21, 27, 0.16)'
                  : '0 12px 32px rgba(42, 21, 27, 0.08)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--color-gold-dark)' }}>
                {couple.monogram}
              </div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7 }}>
                The Wedding Celebration of
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 400,
                  margin: '12px 0 6px',
                }}
              >
                {couple.groom.shortName} & {couple.bride.shortName}
              </h2>

              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '20px' }}>
                {event.dateFormatted}
              </p>

              <div style={{ width: '120px', height: '150px', margin: '0 auto 20px', border: '1px solid var(--color-border-gold)', padding: '4px' }}>
                <SafeImage src={project.weddingData.heroPhoto} alt="Couple" aspectRatio="4/5" />
              </div>

              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.95rem', opacity: 0.9, marginBottom: '20px' }}>
                "{couple.quote}"
              </p>

              <div style={{ padding: '12px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-ivory)', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', color: 'var(--color-burgundy)' }}>
                  {event.holyMatrimony.venue}
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>
                  {event.holyMatrimony.time}
                </span>
              </div>

              <span style={{ fontSize: '0.7rem', color: 'var(--color-charcoal-muted)', opacity: 0.6 }}>
                Active Style: {project.templateId.replace('-', ' ')}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .editor-grid-layout {
            grid-template-columns: 1fr !important;
          }
          .editor-preview-column {
            display: none !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
