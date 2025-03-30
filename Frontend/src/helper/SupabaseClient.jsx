import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://eqrlgxxvqliynihssdyx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcmxneHh2cWxpeW5paHNzZHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTYyMzIsImV4cCI6MjA1ODg5MjIzMn0.22wTYsaLkUTeq4AY3PsbgeULhx2o83NLL3tYTL7flIY'

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;