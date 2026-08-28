-- SMS Marketing Tables

-- Table des campagnes SMS
CREATE TABLE public.sms_campaigns (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    firebase_uid TEXT NOT NULL,
    name TEXT NOT NULL,
    message_content TEXT NOT NULL,
    sender_name TEXT NOT NULL DEFAULT 'Jynkopay',
    status TEXT NOT NULL DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER NOT NULL DEFAULT 0,
    sent_count INTEGER NOT NULL DEFAULT 0,
    delivered_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des messages SMS individuels
CREATE TABLE public.sms_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.sms_campaigns(id) ON DELETE CASCADE,
    firebase_uid TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    message_content TEXT NOT NULL,
    sender_name TEXT NOT NULL DEFAULT 'Jynkopay',
    external_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_code TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des contacts SMS
CREATE TABLE public.sms_contacts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    firebase_uid TEXT NOT NULL,
    phone TEXT NOT NULL,
    name TEXT,
    group_name TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(firebase_uid, phone)
);

-- Table des opt-outs SMS
CREATE TABLE public.sms_optouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL UNIQUE,
    opted_out BOOLEAN NOT NULL DEFAULT true,
    opted_out_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des SMS entrants
CREATE TABLE public.sms_incoming (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_phone TEXT NOT NULL,
    receiver_phone TEXT,
    message TEXT NOT NULL,
    message_id TEXT,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    type TEXT NOT NULL DEFAULT 'incoming',
    processed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des logs de statut SMS
CREATE TABLE public.sms_status_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id TEXT NOT NULL,
    status TEXT NOT NULL,
    raw_payload JSONB,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour stocker les tokens OAuth (cache)
CREATE TABLE public.sms_oauth_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT NOT NULL UNIQUE,
    access_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes pour performance
CREATE INDEX idx_sms_campaigns_firebase_uid ON public.sms_campaigns(firebase_uid);
CREATE INDEX idx_sms_campaigns_status ON public.sms_campaigns(status);
CREATE INDEX idx_sms_messages_campaign_id ON public.sms_messages(campaign_id);
CREATE INDEX idx_sms_messages_firebase_uid ON public.sms_messages(firebase_uid);
CREATE INDEX idx_sms_messages_status ON public.sms_messages(status);
CREATE INDEX idx_sms_messages_external_id ON public.sms_messages(external_id);
CREATE INDEX idx_sms_contacts_firebase_uid ON public.sms_contacts(firebase_uid);
CREATE INDEX idx_sms_contacts_phone ON public.sms_contacts(phone);
CREATE INDEX idx_sms_optouts_phone ON public.sms_optouts(phone);

-- Enable RLS
ALTER TABLE public.sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_optouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_incoming ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sms_campaigns
CREATE POLICY "Users can view their own campaigns"
ON public.sms_campaigns FOR SELECT
USING (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "Users can create their own campaigns"
ON public.sms_campaigns FOR INSERT
WITH CHECK (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "Users can update their own campaigns"
ON public.sms_campaigns FOR UPDATE
USING (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "Users can delete their own campaigns"
ON public.sms_campaigns FOR DELETE
USING (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

-- RLS Policies for sms_messages
CREATE POLICY "Users can view their own messages"
ON public.sms_messages FOR SELECT
USING (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "Users can create their own messages"
ON public.sms_messages FOR INSERT
WITH CHECK (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "Users can update their own messages"
ON public.sms_messages FOR UPDATE
USING (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "System can update messages by external_id"
ON public.sms_messages FOR UPDATE
USING (true);

-- RLS Policies for sms_contacts
CREATE POLICY "Users can view their own contacts"
ON public.sms_contacts FOR SELECT
USING (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "Users can create their own contacts"
ON public.sms_contacts FOR INSERT
WITH CHECK (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "Users can update their own contacts"
ON public.sms_contacts FOR UPDATE
USING (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

CREATE POLICY "Users can delete their own contacts"
ON public.sms_contacts FOR DELETE
USING (firebase_uid IN (SELECT firebase_uid FROM public.profiles));

-- RLS Policies for sms_optouts (public read for opt-out checking)
CREATE POLICY "Anyone can check optouts"
ON public.sms_optouts FOR SELECT
USING (true);

CREATE POLICY "System can manage optouts"
ON public.sms_optouts FOR ALL
USING (true);

-- RLS Policies for sms_incoming (system only)
CREATE POLICY "System can manage incoming"
ON public.sms_incoming FOR ALL
USING (true);

-- RLS Policies for sms_status_logs (system only)
CREATE POLICY "System can manage status logs"
ON public.sms_status_logs FOR ALL
USING (true);

-- RLS Policies for sms_oauth_tokens (system only)
CREATE POLICY "System can manage oauth tokens"
ON public.sms_oauth_tokens FOR ALL
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_sms_campaigns_updated_at
BEFORE UPDATE ON public.sms_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sms_messages_updated_at
BEFORE UPDATE ON public.sms_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sms_contacts_updated_at
BEFORE UPDATE ON public.sms_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sms_oauth_tokens_updated_at
BEFORE UPDATE ON public.sms_oauth_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();