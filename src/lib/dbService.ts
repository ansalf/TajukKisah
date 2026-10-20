import { supabase, isSupabaseConfigured } from './supabase';
import { ProjectInvitation } from '../data/projectData';

export interface DbWedding {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  template_id: string;
  status: 'draft' | 'published' | 'archived';
  monogram: string;
  quote?: string;
  quote_source?: string;
  story_narrative?: string;
  groom_full_name: string;
  groom_short_name: string;
  groom_father?: string;
  groom_mother?: string;
  groom_photo_url?: string;
  bride_full_name: string;
  bride_short_name: string;
  bride_father?: string;
  bride_mother?: string;
  bride_photo_url?: string;
  hero_photo_url?: string;
  wedding_date: string;
  wedding_date_formatted: string;
  audio_url?: string;
  digital_gifts_enabled: boolean;
  digital_gifts_description?: string;
  bank_accounts: any;
  physical_gift_address?: any;
  features: any;
  views_count: number;
  created_at?: string;
  updated_at?: string;
}

export const dbService = {
  // 1. Fetch all weddings belonging to current user
  async getUserWeddings(userId: string): Promise<{ data: ProjectInvitation[] | null; error: Error | null }> {
    if (!isSupabaseConfigured) return { data: null, error: null };

    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return { data: null, error };

      const projects: ProjectInvitation[] = (data || []).map(mapDbToProject);
      return { data: projects, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  // 2. Fetch a single wedding by slug (public invitation)
  async getWeddingBySlug(slug: string): Promise<{ data: ProjectInvitation | null; error: Error | null }> {
    if (!isSupabaseConfigured) return { data: null, error: null };

    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) return { data: null, error };
      if (!data) return { data: null, error: null };

      return { data: mapDbToProject(data), error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  // 3. Check slug availability
  async checkSlugAvailability(slug: string, currentWeddingId?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      let query = supabase.from('weddings').select('id').eq('slug', slug);
      if (currentWeddingId) {
        query = query.neq('id', currentWeddingId);
      }
      const { data, error } = await query;
      if (error) return true;
      return !data || data.length === 0;
    } catch {
      return true;
    }
  },

  // 4. Update publication status
  async togglePublishWedding(weddingId: string, status: 'published' | 'draft'): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) return { error: null };

    try {
      const { error } = await supabase
        .from('weddings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', weddingId);

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  // 5. Upsert / Save wedding project
  async saveWedding(userId: string, project: ProjectInvitation): Promise<{ data: ProjectInvitation | null; error: Error | null }> {
    if (!isSupabaseConfigured) return { data: project, error: null };

    try {
      const payload = mapProjectToDb(userId, project);
      const { data, error } = await supabase
        .from('weddings')
        .upsert(payload, { onConflict: 'slug' })
        .select()
        .single();

      if (error) return { data: null, error };
      return { data: mapDbToProject(data), error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  // 6. Delete wedding
  async deleteWedding(weddingId: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) return { error: null };

    try {
      const { error } = await supabase
        .from('weddings')
        .delete()
        .eq('id', weddingId);

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  // 7. Submit RSVP
  async submitRsvp(weddingId: string, payload: {
    fullName: string;
    contact: string;
    attendance: 'attending' | 'regret';
    paxConfirmed: number;
    dietaryNotes?: string;
  }): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) return { error: null };

    try {
      const { error } = await supabase.from('rsvps').insert({
        wedding_id: weddingId,
        full_name: payload.fullName,
        contact: payload.contact,
        attendance: payload.attendance,
        pax_confirmed: payload.paxConfirmed,
        dietary_notes: payload.dietaryNotes,
      });

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  // 8. Submit Guest Wish
  async submitWish(weddingId: string, payload: {
    name: string;
    relationship?: string;
    message: string;
    attendance: 'attending' | 'regret' | 'tentative';
  }): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) return { error: null };

    try {
      const { error } = await supabase.from('wishes').insert({
        wedding_id: weddingId,
        name: payload.name,
        relationship: payload.relationship,
        message: payload.message,
        attendance: payload.attendance,
      });

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  // 9. Get Public Wishes for a wedding
  async getPublicWishes(weddingId: string): Promise<{ data: any[] | null; error: Error | null }> {
    if (!isSupabaseConfigured) return { data: null, error: null };

    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('created_at', { ascending: false })
        .limit(30);

      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  // 10. Submit Invitation Order Request
  async submitOrder(payload: {
    customerName: string;
    customerEmail: string;
    customerWhatsapp: string;
    templateId: string;
    templateTitle: string;
    groomName: string;
    brideName: string;
    weddingDate: string;
    ceremonyVenue?: string;
    receptionVenue?: string;
    songTitle?: string;
    songArtist?: string;
    songReferenceUrl?: string;
    specialRequests?: string;
  }): Promise<{ data: any | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      // Mock order submission for demo mode
      console.info('Demo mode order submitted:', payload);
      try {
        const storedOrders = JSON.parse(localStorage.getItem('tajuk_demo_orders') || '[]');
        const newOrder = { id: `demo-order-${Date.now()}`, ...payload, created_at: new Date().toISOString() };
        storedOrders.unshift(newOrder);
        localStorage.setItem('tajuk_demo_orders', JSON.stringify(storedOrders));
        return { data: newOrder, error: null };
      } catch {
        return { data: { id: `demo-order-${Date.now()}`, ...payload }, error: null };
      }
    }

    try {
      const { data, error } = await supabase.from('orders').insert({
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_whatsapp: payload.customerWhatsapp,
        template_id: payload.templateId,
        template_title: payload.templateTitle,
        groom_name: payload.groomName,
        bride_name: payload.brideName,
        wedding_date: payload.weddingDate,
        ceremony_venue: payload.ceremonyVenue || null,
        reception_venue: payload.receptionVenue || null,
        song_title: payload.songTitle || null,
        song_artist: payload.songArtist || null,
        song_reference_url: payload.songReferenceUrl || null,
        special_requests: payload.specialRequests || null,
      }).select().single();

      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },
};

// Helper: Map Database Row to ProjectInvitation model
function mapDbToProject(row: DbWedding): ProjectInvitation {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    templateId: (row.template_id as any) || 'editorial-romance',
    status: row.status,
    viewsCount: row.views_count || 0,
    rsvpsCount: 0,
    lastEdited: 'Synced from cloud',
    weddingData: {
      couple: {
        groom: {
          fullName: row.groom_full_name,
          shortName: row.groom_short_name,
          father: row.groom_father || '',
          mother: row.groom_mother || '',
          photoUrl: row.groom_photo_url || '',
        },
        bride: {
          fullName: row.bride_full_name,
          shortName: row.bride_short_name,
          father: row.bride_father || '',
          mother: row.bride_mother || '',
          photoUrl: row.bride_photo_url || '',
        },
        monogram: row.monogram || 'A & B',
        quote: row.quote || '',
        quoteSource: row.quote_source || '',
        storyNarrative: row.story_narrative || '',
      },
      event: {
        dateFormatted: row.wedding_date_formatted,
        dayOfWeek: 'Saturday',
        timeFormatted: '09:00 – 14:00 WIB',
        calendarDate: row.wedding_date,
        holyMatrimony: {
          title: 'Akad Nikah / Holy Matrimony',
          time: '09:00 AM – 10:30 AM',
          venue: 'The Glasshouse',
          address: 'Jakarta',
        },
        reception: {
          title: 'Wedding Reception',
          time: '11:30 AM – 14:00 PM',
          venue: 'Grand Ballroom',
          address: 'Jakarta',
        },
      },
      heroPhoto: row.hero_photo_url || '',
      galleryPhotos: [],
    },
    storyTimeline: [],
    gallery: [],
    digitalGifts: {
      enabled: row.digital_gifts_enabled,
      description: row.digital_gifts_description || '',
      accounts: row.bank_accounts || [],
      physicalGift: row.physical_gift_address || { recipient: '', address: '', phone: '', note: '' },
    },
    features: row.features || {},
  };
}

// Helper: Map ProjectInvitation model to Database Row
function mapProjectToDb(userId: string, p: ProjectInvitation) {
  const couple = p.weddingData.couple;
  const event = p.weddingData.event;

  return {
    user_id: userId,
    slug: p.slug,
    title: p.title,
    template_id: p.templateId,
    status: p.status,
    monogram: couple.monogram,
    quote: couple.quote,
    quote_source: couple.quoteSource,
    story_narrative: couple.storyNarrative,
    groom_full_name: couple.groom.fullName,
    groom_short_name: couple.groom.shortName,
    groom_father: couple.groom.father,
    groom_mother: couple.groom.mother,
    groom_photo_url: couple.groom.photoUrl,
    bride_full_name: couple.bride.fullName,
    bride_short_name: couple.bride.shortName,
    bride_father: couple.bride.father,
    bride_mother: couple.bride.mother,
    bride_photo_url: couple.bride.photoUrl,
    hero_photo_url: p.weddingData.heroPhoto,
    wedding_date: event.calendarDate || '2026-11-28',
    wedding_date_formatted: event.dateFormatted,
    audio_url: p.features.audioUrl,
    digital_gifts_enabled: p.digitalGifts.enabled,
    digital_gifts_description: p.digitalGifts.description,
    bank_accounts: p.digitalGifts.accounts,
    physical_gift_address: p.digitalGifts.physicalGift,
    features: p.features,
    views_count: p.viewsCount,
    updated_at: new Date().toISOString(),
  };
}
