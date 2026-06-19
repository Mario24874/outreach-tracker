-- MarioOS — Default new users to 'client'
-- ============================================================
-- The initial schema defaulted profiles.role to 'admin', so every new signup
-- (including reviewer accounts and customers) became an admin. The business
-- owner is the only admin; everyone else is a client. Flip the default so new
-- profiles are created as 'client'. The owner account is granted 'admin'
-- explicitly (data fix, run once in the SQL Editor / Management API):
--
--   UPDATE public.profiles SET role = 'admin'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'marioivanmorenopineda@gmail.com');
--   UPDATE public.profiles SET role = 'client'
--   WHERE id <> (SELECT id FROM auth.users WHERE email = 'marioivanmorenopineda@gmail.com');

ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'client';
