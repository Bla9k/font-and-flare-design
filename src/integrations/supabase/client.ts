// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kgmddgeclhwllbsbsect.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnbWRkZ2VjbGh3bGxic2JzZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3Njc1MDgsImV4cCI6MjA2MzM0MzUwOH0.5atk9x3-IIyQ1eL6w8_SgpIwX9gOlnTzIKCZn4KgTQI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);