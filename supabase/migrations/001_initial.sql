-- MarioOS MVP — Initial Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  industry TEXT,
  country TEXT,
  phone TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- CONTACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  industry TEXT,
  country TEXT,
  email TEXT,
  stage TEXT DEFAULT 'lead' CHECK (stage IN ('lead', 'responded', 'conversation', 'proposal', 'client')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- WHATSAPP TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  meta_template_name TEXT NOT NULL,
  language TEXT DEFAULT 'es',
  category TEXT,
  status TEXT DEFAULT 'PENDING',
  components JSONB,
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, meta_template_name, language)
);

-- ============================================================
-- WHATSAPP MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  wamid TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'template', 'image', 'audio', 'document')),
  body TEXT,
  template_name TEXT,
  template_params JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_code TEXT,
  error_message TEXT,
  phone_from TEXT,
  phone_to TEXT,
  meta_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_contacts_user ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(phone);
CREATE INDEX IF NOT EXISTS idx_wa_messages_user ON public.wa_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_wa_messages_contact ON public.wa_messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_wa_messages_wamid ON public.wa_messages(wamid);
CREATE INDEX IF NOT EXISTS idx_wa_messages_status ON public.wa_messages(status);
CREATE INDEX IF NOT EXISTS idx_wa_templates_user ON public.wa_templates(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_messages ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Contacts
CREATE POLICY "Users own their contacts" ON public.contacts
  FOR ALL USING (auth.uid() = user_id);

-- Templates
CREATE POLICY "Users own their templates" ON public.wa_templates
  FOR ALL USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users own their messages" ON public.wa_messages
  FOR ALL USING (auth.uid() = user_id);

-- Service role bypass (for webhook inserts)
CREATE POLICY "Service role full access to messages" ON public.wa_messages
  FOR ALL USING (true) WITH CHECK (true);
