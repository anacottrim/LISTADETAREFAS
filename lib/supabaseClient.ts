import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://ooqmizwwkgtxaxtpsqye.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vcW1pend3a2d0eGF4dHBzcXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMzE3NDMsImV4cCI6MjAzOTkwNzc0M30.T__zpaO2cctYzGVxYz5_5wTXnTnoiHIN6XbNloIdf64';

export const supabase = createClient(supabaseUrl, supabaseKey);
