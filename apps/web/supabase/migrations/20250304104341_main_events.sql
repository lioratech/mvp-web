CREATE TYPE event_type AS ENUM ('provento', 'desconto', 'outro');

CREATE TABLE IF NOT EXISTS public.main_events (
    id INT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    type event_type NOT NULL,
    reference_days BOOLEAN NOT NULL,
    reference_hours BOOLEAN NOT NULL,
    reference_value BOOLEAN NOT NULL,
    incidence_inss BOOLEAN NOT NULL,
    incidence_irrf BOOLEAN NOT NULL,
    incidence_fgts BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure only super admins can create or delete entries
CREATE POLICY super_admins_manage_main_events
    ON public.main_events
    AS restrictive
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

-- Allow any authenticated user to read entries
CREATE POLICY authenticated_read_main_events
    ON public.main_events
    AS permissive
    FOR SELECT
    TO authenticated
    USING (true);

-- Enable RLS on the table
ALTER TABLE public.main_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY super_admins_access_main_events
    ON public.main_events
    AS permissive
    FOR SELECT
    TO authenticated
    USING (public.is_super_admin());

-- Índice na coluna type
CREATE INDEX idx_main_events_type ON public.main_events (type);
